import * as vscode from "vscode";
import * as path from "path";
import { Application } from "./App/application";
import {
  ColorType,
  ShapeType,
  CommandType,
  svgResources,
  ShapeData,
} from "./App/types";
import { idGenerator, getNextEnumValue, isShapeMessage } from "./App/helpers";
import debounce from "lodash.debounce";
import { handleShapeCommand } from "./App/shapeCommandHandler";



/**
 * Called when the extension is activated.
 *
 * Sets up the application with the current state of the shapes, and
 * registers a command to launch the webview.
 *
 * @param context The extension context.
 */
export function activate(context: vscode.ExtensionContext) {
  const resourceUri = (relativePath: string) => {
    return vscode.Uri.file(path.join(context.extensionPath, relativePath));
  };


  const launchMenu = vscode.commands.registerCommand(
    "projectmapper.launch",
    () => {
      const panel = vscode.window.createWebviewPanel(
        "projectMapper",
        "Project-Mapper",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [
            resourceUri("src/media"),
            resourceUri("src/icons"),
            resourceUri("src/App"),
          ],
        },
      );    
    },
  );



  /**
   * Creates a URI that can be used in the webview to refer to a file
   * in the extension's directory.
   *
   * @param panel The webview panel.
   * @param relativePath The path to the file within the extension's
   *                     directory.
   * @returns The URI.
   */
  const webViewUri = (panel: vscode.WebviewPanel, relativePath: string) => {
    return panel.webview.asWebviewUri(
      vscode.Uri.file(path.join(context.extensionPath, relativePath)),
    );
  };

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
    const panel = vscode.window.createWebviewPanel(
      "projectMapper",
      "Project-Mapper",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          resourceUri("src/media"),
          resourceUri("src/icons"),
          resourceUri("src/App"),
        ],
      },
    );

    const cssUri = webViewUri(panel, "src/media/global.css");

    const svgObject = svgResources.reduce(
      (list, item) => {
        list[item] = webViewUri(panel, `src/icons/${item}.svg`).toString();
        return list;
      },
      {} as { [key: string]: string },
    );

    // START: Setup application and restore saved shapes
    const app = new Application(svgObject, panel);
    let shapes: ShapeData[] =
      context.workspaceState.get<ShapeData[]>("shapes") || [];

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

    const updateWebView = () => {
      panel.webview.html = app.webViewContent(cssUri, app.canvas.getShapes());
    };

    updateWebView();
    app.canvas.shapeManager.addListener(updateWebView);

    // END OF START

    panel.webview.onDidReceiveMessage((message) => {
      shapes = context.workspaceState.get("shapes") || [];

      if (!isShapeMessage(message)) {
        vscode.window.showErrorMessage("Invalid message received");
        return;
      }

      // ===== Shape Lifecycle =====

      shapes = handleShapeCommand(
        message,
        app,
        shapes,
        updateShapesGlobal,
        app.saveState.bind(app),
      );
  
    });
  });

  context.subscriptions.push(open);
}

export function deactivate() {}



// Comand handler for adding shapes
