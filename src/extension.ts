import * as vscode from "vscode";
import * as path from "path";
import { Application } from "./App/application";
import {
  ShapeType,
  svgResources,
  ShapeData,
} from "./App/types";
import { getNextEnumValue, isShapeMessage } from "./App/helpers";
import debounce from "lodash.debounce";
import { handleShapeCommand } from "./App/shapeCommandHandler";
import MenuHandler from "./App/Menu/MenuHandler";

/**
 * Called when the extension is activated.
 *
 * Sets up the application with the current state of the shapes, and
 * registers commands to launch the menu and open canvases.
 *
 * @param context The extension context.
 */
export function activate(context: vscode.ExtensionContext) {
  /**
   * Generates a file URI for a given relative path within the extension's directory.
   *
   * @param relativePath - The path to the file relative to the extension's root directory.
   * @returns A vscode.Uri object representing the file URI.
   */
  const resourceUri = (relativePath: string) => {
    return vscode.Uri.file(path.join(context.extensionPath, relativePath));
  };

  /**
   * Creates a URI that can be used in the webview to refer to a file
   * in the extension's directory.
   *
   * @param panel The webview panel.
   * @param relativePath The path to the file within the extension's directory.
   * @returns The URI.
   */
  const webViewUri = (panel: vscode.WebviewPanel, relativePath: string) => {
    return panel.webview.asWebviewUri(
      vscode.Uri.file(path.join(context.extensionPath, relativePath)),
    );
  };

  // =====================================
  // ========== MENU WEBVIEW =============
  // =====================================

  const launchMenu = vscode.commands.registerCommand(
    "projectmapper.launch",
    () => {
      // Create menu panel
      const menuPanel = vscode.window.createWebviewPanel(
        "projectMapper",
        "Project-Mapper-Menu",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [
            resourceUri("src/styles"),
            resourceUri("src/icons"),
            resourceUri("src/App"),
          ],
        },
      );

      // Menu CSS
      const cssUriMenu = webViewUri(menuPanel, "src/styles/menu.css");

      // Helper to build SVG icon paths
      const createSvgObject = (panel: vscode.WebviewPanel) =>
        svgResources.reduce((list, item) => {
          list[item] = webViewUri(panel, `src/icons/${item}.svg`).toString();
          return list;
        }, {} as { [key: string]: string });

      const svgObjectMenu = createSvgObject(menuPanel);

      const updateWebView = debounce(() => {
            menuPanel.webview.html = menuHandler.webViewContent();
          }, 500);

      // Render Menu
      const menuHandler = MenuHandler.getInstance(cssUriMenu, svgObjectMenu);
      menuHandler.initialize();
      MenuHandler.eventListener.addListener(updateWebView);
        // 
      // Retrieve all saved canvases
      let canvases: any[] = context.workspaceState.get("canvases") || [];
      menuHandler.setCanvases(canvases);
      
      menuPanel.webview.html = menuHandler.webViewContent();

      // Track Application instances per canvas
      const appInstances: Record<string, Application> = {};

      // Listen for menu events
      menuPanel.webview.onDidReceiveMessage((message) => {
        if (message.command === "openCanvas") {
          const canvasId = message.canvasId;
          const canvasData = canvases.find((c) => c.id === canvasId);

          if (!canvasData) {
            vscode.window.showErrorMessage("Canvas not found.");
            return;
          }

          // Load shapes specific to this canvas
          let shapes: ShapeData[] =
            context.workspaceState.get<ShapeData[]>(`shapes_${canvasId}`) || [];

          // Create panel for the selected canvas
          const panel = vscode.window.createWebviewPanel(
            "projectMapper",
            `Project-Mapper - ${canvasData.name}`,
            vscode.ViewColumn.One,
            {
              enableScripts: true,
              retainContextWhenHidden: true,
              localResourceRoots: [
                resourceUri("src/styles"),
                resourceUri("src/icons"),
                resourceUri("src/App"),
              ],
            },
          );

          const cssUri = webViewUri(panel, "src/styles/global.css");
          const svgObject = createSvgObject(panel);

          // Create or reuse Application instance for this canvas
          if (!appInstances[canvasId]) {
            appInstances[canvasId] = new Application(svgObject);
          }
          const app = appInstances[canvasId];

          // Setup shapes for this canvas
          app.setUpCanvas(
            shapes.map(({ shape, id, color, nextColor, coordinates, dimensions }) => {
              const resolvedNextColor = nextColor ?? getNextEnumValue(color);
              const resolvedCoordinates = coordinates ?? { x: 0, y: 0 };
              const resolvedDimensions = dimensions ?? { length: 100, width: 100 };
              return app.createShape(
                shape as ShapeType,
                id,
                color,
                resolvedNextColor,
                resolvedCoordinates,
                resolvedDimensions,
              );
            }),
          );

          // Render Canvas
          const updateWebView = () => {
            panel.webview.html = app.webViewContent(cssUri, app.canvas.getShapes());
          };

          updateWebView();
          app.canvas.shapeManager.addListener(updateWebView);

          // Listen for canvas events
          panel.webview.onDidReceiveMessage((message) => {
            shapes =
              context.workspaceState.get<ShapeData[]>(`shapes_${canvasId}`) || [];

            // Keep shape validation in place
            if (!isShapeMessage(message)) {
              vscode.window.showErrorMessage("Invalid message received");
              return;
            }

            // Handle shape lifecycle events
            shapes = handleShapeCommand(
              message,
              app,
              shapes,
              (updatedShapes) => {
                // Save shapes for this canvas
                context.workspaceState.update(`shapes_${canvasId}`, updatedShapes);
              },
              app.saveState.bind(app),
            );
          });
        }
        else if (message.command === "createCanvas") {
          const canvasName = message.canvasName;
          // if (!canvasName) {
          //   vscode.window.showErrorMessage("Canvas name cannot be empty.");
          //   return;
          // }

          // Create new canvas
          const newCanvas = {
            id: Date.now().toString(),
            name: canvasName,
          };
          canvases.push(newCanvas);
          context.workspaceState.update("canvases", canvases);

          // Update menu with new canvas
          menuPanel.webview.postMessage({
            command: "updateCanvases",
            canvases,
          });
        }
        else if (message.command === "updateCanvases") {  
          canvases = message.canvases;
          context.workspaceState.update("canvases", canvases);
        }
      });

      // No manual dispose needed, VSCode handles it
      menuPanel.onDidDispose(() => {}, null, context.subscriptions);
    },
  );

  // =====================================
  // ========== CANVAS WEBVIEW ===========
  // =====================================

  const updateShapesGlobal = debounce((shapes: ShapeData[]) => {
    try {
      context.workspaceState.update("shapes", shapes);
    } catch (e) {
      console.error(e);
      vscode.window.showErrorMessage(
        "An error occurred while saving shapes. Please try again.",
      );
    }
  }, 500);

  const open = vscode.commands.registerCommand("projectmapper.open", () => {
    // Currently commented-out, can be refactored to match launchMenu’s canvas logic
    const panel = vscode.window.createWebviewPanel(
      "projectMapper",
      "Project-Mapper",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          resourceUri("src/styles"),
          resourceUri("src/icons"),
          resourceUri("src/App"),
        ],
      },
    );

    // This command can be updated to support independent canvases like launchMenu
  });

  // Register commands
  context.subscriptions.push(open);
  context.subscriptions.push(launchMenu);
}

/**
 * Called when the extension is deactivated.
 */
export function deactivate() {}
