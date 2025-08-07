import { Application } from "./App/application";
import * as vscode from "vscode";
import debounce from "lodash.debounce";
import { menuCommandHandler } from "./App/Handlers/menuCommandHandler";
import MenuHandler from "./App/Menu/MenuHandler";
import { resourceUri, webViewUri, createSvgObject } from "./App/webviewUtils";
import { canvasType } from "./App/types";

export function activate(context: vscode.ExtensionContext) {
  // =====================================
  // ========== MENU WEBVIEW =============
  // =====================================

  const launchMenu = vscode.commands.registerCommand(
    "projectmapper.launch",
    () => {
      const menuPanel = vscode.window.createWebviewPanel(
        "projectMapper",
        "Project-Mapper-Menu",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [
            resourceUri("src/styles", context),
            resourceUri("src/icons", context),
            resourceUri("src/App", context),
          ],
        },
      );

      const cssUriMenu = webViewUri(menuPanel, "src/styles/menu.css", context);
      const svgObjectMenu = createSvgObject(menuPanel, context);

      // Render Menu
      const menuHandler = MenuHandler.getInstance(cssUriMenu, svgObjectMenu);

      // Render Canvas
      const updateWebView = debounce(() => {
        menuPanel.webview.html = menuHandler.webViewContent();
      }, 500);

      // Listen for menu events
      MenuHandler.eventListener.addListener(updateWebView);

      // Retrieve all saved canvases
      let canvases: canvasType[] = context.workspaceState.get("canvases") || [];
      menuHandler.setCanvases(canvases);

      menuPanel.webview.html = menuHandler.webViewContent();

      // Track Application instances per canvas
      const appInstances: Record<string, Application> = {};

      // Listen for menu events
      menuPanel.webview.onDidReceiveMessage((message) => {
        const command = message.command;
        try {
          menuCommandHandler(
            command,
            message,
            context,
            canvases,
            appInstances,
            (updatedCanvases) => {
              canvases = updatedCanvases;
              menuHandler.setCanvases(updatedCanvases);
              menuPanel.webview.html = menuHandler.webViewContent();
              context.workspaceState.update("canvases", updatedCanvases);
            },
          );
        } catch (error) {
          console.error("Error handling menu command:", error);
          vscode.window.showErrorMessage(
            "An error occurred while processing the command. Please try again.",
          );
        }
      });

      menuPanel.onDidDispose(() => {}, null, context.subscriptions);
    },
  );

  context.subscriptions.push(launchMenu);
}

/**
 * Called when the extension is deactivated.
 */
export function deactivate() {}
