import * as vscode from "vscode";
import * as path from "path";
import { Shape } from "./App/shape";
import Application from "./App/webView";


export function activate(context: vscode.ExtensionContext) {

  const resourceUri = (relativePath: string) => {
    return vscode.Uri.file(path.join(context.extensionPath,relativePath));
  
  };

  const webViewUri = (panel: vscode.WebviewPanel, relativePath: string) => {
    return panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, relativePath)));
  };

  const open = vscode.commands.registerCommand("projectmapper.launch", () => {
    
    const panel = vscode.window.createWebviewPanel(
      "projectMapper",
      "Project-Mapper",
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [resourceUri("src/media"), resourceUri("src/icons"), resourceUri("src/App")
        ]
      }
    );

    const cssUri = webViewUri(panel, "src/media/global.css");
    const svgResources = ["plus", "arrow", "square", "triangle", "circle"].reduce((list, item) => {
      list[item] = webViewUri(panel, `src/icons/${item}.svg`).toString();
      return list;
    }, {} as {[key: string]: string});
    
    const app = new Application(svgResources, panel);
    const shapes : Shape[] = context.workspaceState.get("shapes") || [];
    
    panel.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case "Add":
          vscode.window.showInformationMessage(`Shape added: ${message.text}`);
          const shape = app.createShape(message.text);
          if (shape) {
            shapes.push(shape);
            context.workspaceState.update("shapes", shapes);
          }
          break;
      }
    });
    panel.webview.html = app.webViewContent(cssUri, shapes);

    const disposable = panel.onDidDispose(() => {
      disposable.dispose();
    });
    
  });

  context.subscriptions.push(open);

}


export function deactivate() {}
