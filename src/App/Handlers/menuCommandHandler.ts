import { MenuCommandType } from "../types";
import { Application } from "../application";
import * as vscode from "vscode";
import { getNextEnumValue, isShapeMessage } from "../helpers";
import { ShapeData, ShapeType } from "../types";
import { handleShapeCommand } from "./shapeCommandHandler";
import { resourceUri, webViewUri, createSvgObject } from "../webviewUtils";

export function menuCommandHandler(
  command: MenuCommandType,
  message: any,
  context: vscode.ExtensionContext,
  canvases: any[],
  appInstances: { [key: string]: Application },
) {
  switch (command) {
    case MenuCommandType.openCanvas:
      const canvasId = message.canvasId;
      console.log("Opening canvas with ID:", canvasId);
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
            resourceUri("src/styles", context),
            resourceUri("src/icons", context),
            resourceUri("src/App", context),
          ],
        },
      );

      const cssUri = webViewUri(panel, "src/styles/global.css", context);
      const svgObject = createSvgObject(panel, context);

      // Create or reuse Application instance for this canvas
      if (!appInstances[canvasId]) {
        appInstances[canvasId] = new Application(svgObject);
      }
      const app = appInstances[canvasId];

      // Setup shapes for this canvas
      app.setUpCanvas(
        shapes.map(
          ({ shape, id, color, nextColor, coordinates, dimensions }) => {
            const resolvedNextColor = nextColor ?? getNextEnumValue(color);
            const resolvedCoordinates = coordinates ?? { x: 0, y: 0 };
            const resolvedDimensions = dimensions ?? {
              length: 100,
              width: 100,
            };
            return app.createShape(
              shape as ShapeType,
              id,
              color,
              resolvedNextColor,
              resolvedCoordinates,
              resolvedDimensions,
            );
          },
        ),
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

      break;
    case MenuCommandType.removeCanvas:
      // Handle closing menu
      break;
    // Add other cases as needed
    case MenuCommandType.createCanvas:
      // Handle creating a new canvas
      break;
    case MenuCommandType.updateCanvases:
      canvases = message.canvases;
      context.workspaceState.update("canvases", canvases);
      break;
    case MenuCommandType.renameCanvas:
      // Handle renaming a canvas
      break;
    case MenuCommandType.clearAll:
      canvases = [];
      context.workspaceState.update("canvases", canvases);
      break;
    default:
      // Handle unknown command
      break;
  }
}
