import { canvasType, MenuCommandType } from "../types";
import { Application } from "../application";
import * as vscode from "vscode";
import { getNextEnumValue, isShapeMessage } from "../helpers";
import { ShapeData, ShapeType } from "../types";
import { handleShapeCommand } from "./shapeCommandHandler";
import { resourceUri, webViewUri, createSvgObject } from "../webviewUtils";
import { filter } from "lodash";

export function menuCommandHandler(
  command: MenuCommandType,
  message: any,
  context: vscode.ExtensionContext,
  canvases: any[],
  appInstances: { [key: string]: Application },
  updateCanvases: (canvases: any[]) => void,
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
            context.workspaceState.update(`shapes_${canvasId}`, updatedShapes);
          },
          app.saveState.bind(app),
        );
      });

      panel.onDidDispose(
        () => {
          app.canvas.shapeManager.removeListener(updateWebView);
          delete appInstances[canvasId];
        },
        null,
        context.subscriptions,
      );

      break;
    case MenuCommandType.removeCanvas:
      // Handle closing menu
      const newCanvases = canvases.filter(
        (c: canvasType) => c.id !== message.canvasId,
      );
      if (newCanvases) {
        updateCanvases(newCanvases);
      }
      break;
    // Add other cases as needed
    case MenuCommandType.createCanvas:
      const newCanvas = {
        id: Date.now().toString(),
        name: "New Canvas",
        dateCreated: new Date().toLocaleString().replace(",", ""),
      };
      const newCanvasList = [...canvases, newCanvas]; // don't mutate original
      updateCanvases(newCanvasList);
      break;

    case MenuCommandType.renameCanvas:
      {
        // Handle renaming a canvas
        const canvasIndex = canvases.findIndex(
          (c: canvasType) => c.id === message.canvasId,
        );
        if (canvasIndex !== -1) {
          canvases[canvasIndex].name = message.name;
          updateCanvases([...canvases]);
        }
      }
      break;
    case MenuCommandType.clearAll:
      {
        // Handle clearing all canvases
        const newcanvases = [];
        updateCanvases(canvases);
      }
      break;
    default:
      // Handle unknown command
      break;
  }
}
