import * as vscode from "vscode";
import * as path from "path";
import getWebViewContent from "./App/webViewContent";


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
  const svgUri = webViewUri(panel, "src/icons/plus.svg").toString();
	  
  panel.webview.html = getWebViewContent(cssUri, svgUri); // imported from App dir 

  });


  context.subscriptions.push(open);

}


export function deactivate() {}
