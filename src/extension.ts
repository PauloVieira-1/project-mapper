import * as vscode from "vscode";
import * as path from "path";
import {Application} from "./App/application";

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

    // START OF APP

    const app = new Application(svgResources, panel);
    const shapes: string[]= context.workspaceState.get("shapes") || []; 
    app.setUpCanvas(shapes.map(shape => app.createShape(shape)));
    
    const updateWebView = () => {
      panel.webview.html = app.webViewContent(cssUri, app.canvas.getShapes());
    };

    updateWebView();
    app.canvas.shapeManager.addListener(updateWebView);
    
    // START OF APP

    panel.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case "Add":
          vscode.window.showInformationMessage(`Shape added: ${message.text}`);
          app.canvas.addShape(app.createShape(message.text));
          context.workspaceState.update("shapes", [...shapes, message.text]);
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
