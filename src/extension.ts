import * as vscode from "vscode";
import * as path from "path";
import { Shape } from "./App/shape";
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

    const app = new Application(svgResources, panel);

    const shapes: string[]= context.workspaceState.get("shapes") || []; // make constant 
    app.setUpCanvas(shapes.map(shape => app.createShape(shape)));


    panel.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case "Add":
          vscode.window.showInformationMessage(`Shape added: ${message.text}`);
          const newShape = app.createShape(message.text);
          app.canvas.addShape(newShape);
          // shapes.push(message.text);
          context.workspaceState.update("shapes", [...shapes, message.text]);
          break;

        case "Clear":
          shapes.length = 0;
          context.workspaceState.update("shapes", shapes);
          app.setUpCanvas([]);
          console.log("WORKPLACE CLEARED");
          break;
      }


    });


    const updateWebView = (objectArray: Shape[]) => {
      panel.webview.html = app.webViewContent(cssUri, objectArray);
    };

    function renderWebView() {

      const renderInterval = setInterval(() => {
        updateWebView([]);
        updateWebView(app.canvas.getShapes());
      }, 800);

      panel.onDidDispose(() => {
        clearInterval(renderInterval);
      });
      
      panel.onDidDispose(() => clearInterval(renderInterval));
    }

    renderWebView();
    
    //! Request animation frame maybe

  });

  context.subscriptions.push(open);
}

export function deactivate() {}
