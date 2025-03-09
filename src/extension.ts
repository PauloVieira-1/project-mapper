import * as vscode from "vscode";
import * as path from "path";
import { Shape } from "./App/shape";
import Application from "./App/webView";

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
    const shapes: string[] = context.workspaceState.get("shapes") || [];

    panel.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case "Add":
          vscode.window.showInformationMessage(`Shape added: ${message.text}`);
          shapes.push(message.text);
          context.workspaceState.update("shapes", shapes);
          break;

        case "Clear":
          shapes.length = 0;
          context.workspaceState.update("shapes", shapes);
          console.log("WORKPLACE CLEARED");
          break;
      }
    });

    const updateWebView = (objectArray: Shape[]) => {
      panel.webview.html = app.webViewContent(cssUri, objectArray);
    };

    setInterval(() => {
      const objectArray: Shape[] = shapes.map((element: string) => {
        return app.createShape(element);
      });

      updateWebView(objectArray);
    }, 800);

    const disposable = panel.onDidDispose(() => {
      disposable.dispose();
    });
  });

  context.subscriptions.push(open);
}

export function deactivate() {}
