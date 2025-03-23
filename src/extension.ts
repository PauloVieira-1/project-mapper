import * as vscode from "vscode";
import * as path from "path";
import {Application} from "./App/application";
import { Shape } from "./App/shape";

const idGenerator = (): number => {
  return Math.random()* 100;
};

export function activate(context: vscode.ExtensionContext) {
  const resourceUri = (relativePath: string) => {
    return vscode.Uri.file(path.join(context.extensionPath, relativePath));
  };

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
    ].reduce(
      (list, item) => {
        list[item] = webViewUri(panel, `src/icons/${item}.svg`).toString();
        return list;
      },
      {} as { [key: string]: string }, 
    );

    // START 

    const app = new Application(svgResources, panel);
    const shapes: {shape: string, id: number}[]= context.workspaceState.get("shapes") || []; 
    app.setUpCanvas(shapes.map(shape => app.createShape(shape.shape, shape.id)));
    
    const updateWebView = () => {
      panel.webview.html = app.webViewContent(cssUri, app.canvas.getShapes());
    };

    updateWebView();
    app.canvas.shapeManager.addListener(updateWebView);
    
    // END OF START

    panel.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case "Add":
          const shapeId = idGenerator();
          vscode.window.showInformationMessage(`Shape added: ${message.text}`);
          app.canvas.addShape(app.createShape(message.text, shapeId));
          context.workspaceState.update("shapes", [...shapes, {shape: message.text, id: shapeId}]);
          break;
        case "Remove":
          console.log("REMOVED"); 
          const shapeToRemove = app.canvas.getShapes().find(shape => shape.id === message.id);
          if (shapeToRemove) {
            app.canvas.removeShape(shapeToRemove.id);
            context.workspaceState.update("shapes", shapes.filter(shape => shape.id !== message.id));
          }
          break;
        case "Clear":
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
