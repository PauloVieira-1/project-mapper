import * as vscode from "vscode";
import * as path from "path";
import { Application } from "./App/application";
import { ColorType } from "./App/types";

// Simple ID generator using timestamp and random value to avoid collisions
const idGenerator = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

export function activate(context: vscode.ExtensionContext) {
  // Helper to resolve file paths within the extension
  const resourceUri = (relativePath: string) => {
    return vscode.Uri.file(path.join(context.extensionPath, relativePath));
  };

  // Resolves a URI to a Webview-safe URI
  const webViewUri = (panel: vscode.WebviewPanel, relativePath: string) => {
    return panel.webview.asWebviewUri(
      vscode.Uri.file(path.join(context.extensionPath, relativePath)),
    );
  };

  // Cycles through enum values
  function getNextEnumValue(current: ColorType): ColorType {
    const values = Object.values(ColorType) as ColorType[];
    const index = values.indexOf(current);
    const nextIndex = (index + 1) % values.length;
    return values[nextIndex];
  }

  // Register the 'launch' command
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
      coordinates: { x: number; y: number };
    }[] = context.workspaceState.get("shapes") || [];

    app.setUpCanvas(
      shapes.map(({ shape, id, color, coordinates }) =>
        app.createShape(
          shape,
          id,
          color,
          coordinates ?? { x: 0, y: 0 } // fallback to default
        )
      )
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
            app.createShape(message.text, shapeId, ColorType.DarkBlue, {
              x: 0,
              y: 0,
            }),
          );

          // Update persistent storage
         const newShapes = [...shapes, {
            shape: message.text,
            id: shapeId,
            color: ColorType.DarkBlue,
            coordinates: { x: 0, y: 0 }  
          }];
          context.workspaceState.update("shapes", newShapes);
          break;

        case "Remove":
          const shapeToRemove = app.canvas
            .getShapes()
            .find((shape) => shape.id === message.id);
          if (shapeToRemove) {
            app.canvas.removeShape(shapeToRemove.id);

            // Remove from state and update
            const updatedShapes = shapes.filter(
              (shape) => shape.id !== message.id,
            );
            context.workspaceState.update("shapes", updatedShapes);
          }
          break;

        case "Color":
          const shapeToColor = app.canvas
            .getShapes()
            .find((shape) => shape.id === message.id);
          if (shapeToColor) {
            const newColor = getNextEnumValue(shapeToColor.color);
            app.canvas.changeColor(shapeToColor.id, newColor);

            // Update color in state
            const recoloredShapes = shapes.map((shape) =>
              shape.id === message.id ? { ...shape, color: newColor } : shape,
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
        case "Clear":
          // Clear all shapes from canvas and state
          context.workspaceState.update("shapes", []);
          app.setUpCanvas([]);
          console.log("WORKPLACE CLEARED");
          break;
      }
    });
  });

  context.subscriptions.push(open);
}

export function deactivate() {}
