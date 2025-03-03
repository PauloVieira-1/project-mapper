import * as vscode from "vscode";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  const open = vscode.commands.registerCommand("projectmapper.launch", () => {
    vscode.window.showInformationMessage("Opening Project-Mapper...");

    const panel = vscode.window.createWebviewPanel(
      "projectMapper",
      "Project-Mapper",
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, "./media")) 
        ]
      }
    );

	const cssUri = panel.webview.asWebviewUri(
		vscode.Uri.file(path.join(context.extensionPath, "src", "media", "global.css"))
	  );
	  

    panel.webview.html = getWebViewContent(cssUri);
  });

  context.subscriptions.push(open);
}

function getWebViewContent(cssUri: vscode.Uri): string {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Project-Mapper</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
      <link rel="stylesheet" type="text/css" href="${cssUri}">
  </head>
  <body>
      <div class="container mx-auto my-10">
          <h1 class="text-3xl font-bold my-5">Project-Mapper</h1>
          <a class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
             href="https://github.com/PauloVieira-1/project-mapper" 
             target="_blank" rel="noopener noreferrer">
              Go to Github!
          </a>
      </div>
      <div class="grid-background h-screen">
          <h1 class="text-3xl font-bold my-5">Project-Mapper</h1>
      </div>
  </body>
  </html>`;
}

export function deactivate() {}
