import * as vscode from 'vscode';
import * as path from 'path';
import { time } from 'console';

export function activate(context: vscode.ExtensionContext) {

	const iconPath = vscode.Uri.file(
		path.join(context.extensionPath, 'icons', 'icon.png')
	  );

	const panel = vscode.commands.registerCommand('projectmapper.launch', () => {

		setTimeout(() => {
			vscode.window.showInformationMessage('Opening Project-Mapper...');
		}, 1000);

		vscode.window.createWebviewPanel('projectMapper', 'Project-Mapper', vscode.ViewColumn.Two, {
			enableScripts: true,
			retainContextWhenHidden: true,
			localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'icons'))]
		  }).webview.html = getWebViewContent();
	});

	const getWebViewContent = () => {
		return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Project-Mapper</title>
			<link rel="stylesheet" href="https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css" />
			<script src="https://cdn.tailwindcss.com"></script>
		</head>
		<body>
		<div class="container mx-auto my-10">
		<h1 class="text-3xl font-bold my-5">Project-Mapper</h1>
		<a class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" href="https://github.com/PauloVieira-1/project-mapper" target="_blank" rel="noopener noreferrer">
			  Go to Github
		</a>			
		</div>
		</body>
		</html>`;
	  };


	context.subscriptions.push(panel);
}

export function deactivate() {}
