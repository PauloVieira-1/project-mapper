import * as vscode from "vscode";
import * as path from "path";
import { Application } from "./App/application";
import { ColorType, ShapeType, CommandType, svgResources, ShapeData } from "./App/types";
import { idGenerator, getNextEnumValue, isShapeMessage } from "./App/helpers";
import debounce from "lodash.debounce";

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

  const updateShapes = debounce((shapes: ShapeData[]) => {
    try {
      context.workspaceState.update("shapes", shapes);
    } catch (e) {
      console.error(e);
      vscode.window.showErrorMessage(
        "An error occurred while saving shapes. Please try again.");
    }
  }, 500);

  const open = vscode.commands.registerCommand("projectmapper.launch", () => {
    const panel = vscode.window.createWebviewPanel(
      "projectMapper",
      "Project-Mapper",
      vscode.ViewColumn.Two,
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
    let shapes: ShapeData[] = context.workspaceState.get<ShapeData[]>("shapes") || [];

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
      switch (message.command) {
        case CommandType.AddShape:
          const shapeId = idGenerator();

          app.canvas.addShape(
            app.createShape(
              message.text,
              shapeId,
              ColorType.DarkBlue,
              ColorType.Green,
              {
                x: 0,
                y: 0,
              },
              {
                length: 100,
                width: 100,
              },
            ),
          );

          const newShapes = [
            ...shapes,
            {
              shape: message.text,
              id: shapeId,
              color: ColorType.DarkBlue,
              nextColor: ColorType.Green,
              coordinates: { x: 0, y: 0 },
              dimensions: { length: 100, width: 100 },
            },
          ];
          updateShapes(newShapes);
          break;

        case CommandType.RemoveShape:
          const shapeToRemove = app.canvas
            .getShapes()
            .find((shape) => shape.id === message.id);
          if (shapeToRemove) {
            app.canvas.removeShape(shapeToRemove.id);

            const updatedShapes = shapes.filter(
              (shape) => shape.id !== message.id,
            );
            updateShapes(updatedShapes);
          }
          break;

        // ===== Shape Appearance =====
        case CommandType.ChangeColor:
          const shapeToColor = app.canvas
            .getShapes()
            .find((shape) => shape.id === message.id);
          if (shapeToColor) {
            const newColor = getNextEnumValue(shapeToColor.color);
            const newNextColor = getNextEnumValue(newColor);

            app.canvas.changeColor(shapeToColor.id, newColor, newNextColor);

            const recoloredShapes = shapes.map((shape) =>
              shape.id === message.id
                ? {
                    ...shape,
                    color: newColor,
                    nextColor: newNextColor,
                    coordinates: shape.coordinates ?? { x: 0, y: 0 }, 
                  }
                : shape,
            );
            console.log(recoloredShapes.map((shape) => shape.coordinates));
            updateShapes(recoloredShapes);
          }
          break;
        
        // ===== Shape Actions =====
        case CommandType.MoveShape:
          const shapeToMove = app.canvas
            .getShapes()
            .find((shape) => shape.id === message.id);

          if (shapeToMove) {
            app.canvas.moveShape(
              shapeToMove.id,
              message.translateX,
              message.translateY,
            );

            const updatedShapes = shapes.map((shape) =>
              shape.id === message.id
                ? {
                    ...shape,
                    coordinates: {
                      x: message.translateX,
                      y: message.translateY,
                    },
                  }
                : shape,
            );
            updateShapes(updatedShapes);
          }

          break;
        case CommandType.resizeShape:
          const shapeToResive = app.canvas
            .getShapes()
            .find((shape) => shape.id === message.id);

          if (shapeToResive) {
            app.canvas.resizeShape(
              shapeToResive.id,
              message.width,
              message.height
            );
          }
          const updatedShapes = shapes.map((shape) =>
            shape.id === message.id
              ? {
                  ...shape,
                  dimensions: {
                    length: message.width,
                    width: message.height,
                  },
                }
              : shape
          );
          updateShapes(updatedShapes);
        
        break;

        case CommandType.saveState:
          app.saveState();
          break;
        case CommandType.Clear:
          updateShapes([]);
          app.setUpCanvas([]);
          break;
        case CommandType.undo:
          app.caretaker.undo(app.canvas);
          break;
        case CommandType.redo:
          app.caretaker.redo(app.canvas);
          break;
        default:
          break;
      }
    });
  });

  context.subscriptions.push(open);
}

export function deactivate() {}
