import * as vscode from "vscode";
import * as path from "path";
import getWebViewContent from "./App/webViewContent";
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
    const plusUri = webViewUri(panel, "src/icons/plus.svg").toString();
    const arrowUri = webViewUri(panel, "src/icons/arrow.svg").toString();
    const squareUri = webViewUri(panel, "src/icons/square.svg").toString();
    const triangleUri = webViewUri(panel, "src/icons/triangle.svg").toString();
    const circleUri = webViewUri(panel, "src/icons/circle.svg").toString();
  
    const svgObject: any = {
      plus: plusUri,
      arrow: arrowUri,
      square: squareUri,
      triangle: triangleUri,
      circle: circleUri
    };
  
    const app = new Application(svgObject, panel);

    const shapes : string[] = [];

    panel.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case "Add":
          vscode.window.showInformationMessage(`Shape added: ${message.text}`);
          const shape = app.createShape(message.text);
          if (shape) {
            shapes.push(shape);
          }
          console.log(shapes);
          break;
      }
    });


    const disposable = panel.onDidDispose(() => {
      disposable.dispose();
    });

  // Front end interaction with back end

  panel.webview.html = app.webViewContent(cssUri);

  });

  context.subscriptions.push(open);

}


export function deactivate() {}
