import * as vscode from "vscode";
import * as path from "path";
import { Application } from "./App/application";
import { ColorType, ShapeType } from "./App/types";
import { idGenerator, getNextEnumValue } from "./App/helpers";

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

    const svgResources = [
      "plus",
      "arrow",
      "square",
      "triangle",
      "circle",
      "trash",
      "list",
      "redo",
      "undo",
      "download",
    ].reduce(
      (list, item) => {
        list[item] = webViewUri(panel, `src/icons/${item}.svg`).toString();
        return list;
      },
      {} as { [key: string]: string },
    );

    // START: Setup application and restore saved shapes
    const app = new Application(svgResources, panel);
    let shapes: {
      shape: string;
      id: number;
      color: ColorType;
      nextColor: ColorType;
      coordinates: { x: number; y: number };
    }[] = context.workspaceState.get("shapes") || [];

    app.setUpCanvas(
      shapes.map(({ shape, id, color, nextColor, coordinates }) => {
        const resolvedNextColor = nextColor ?? getNextEnumValue(color);
        const resolvedCoordinates = coordinates ?? { x: 0, y: 0 };
        console.log(shape, id, color, resolvedNextColor, resolvedCoordinates);
        return app.createShape(
          shape as ShapeType,
          id,
          color,
          resolvedNextColor,
          resolvedCoordinates,
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

      switch (message.command) {
        case "Add":
          const shapeId = idGenerator();
          vscode.window.showInformationMessage(`Shape added: ${message.text}`);

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
            ),
          );

          const newShapes = [
            ...shapes,
            {
              shape: message.text,
              id: shapeId,
              color: ColorType.DarkBlue,
              coordinates: { x: 0, y: 0 },
            },
          ];
          context.workspaceState.update("shapes", newShapes);
          break;

        case "Remove":
          const shapeToRemove = app.canvas
            .getShapes()
            .find((shape) => shape.id === message.id);
          if (shapeToRemove) {
            app.canvas.removeShape(shapeToRemove.id);

            const updatedShapes = shapes.filter(
              (shape) => shape.id !== message.id,
            );
            context.workspaceState.update("shapes", updatedShapes);
          }
          break;

        case "nextColor":
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
                  }
                : shape,
            );
            context.workspaceState.update("shapes", recoloredShapes);
          }
          break;
        case "Move":
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

            context.workspaceState.update("shapes", updatedShapes);
          }

          break;
        case "saveState":
          app.saveState();
          break;
        case "Clear":
          context.workspaceState.update("shapes", []);
          app.setUpCanvas([]);
          console.log("WORKPLACE CLEARED");
          break;
        case "Undo":
          app.caretaker.undo(app.canvas);
          break;
        case "Redo":
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
