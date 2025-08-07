import { Application } from "./App/application";
import * as vscode from "vscode";
import debounce from "lodash.debounce";
import { menuCommandHandler } from "./App/Handlers/menuCommandHandler";
import MenuHandler from "./App/Menu/MenuHandler";
import { resourceUri, webViewUri, createSvgObject } from "./App/webviewUtils";

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

      const updateWebView = debounce(() => {
        menuPanel.webview.html = menuHandler.webViewContent();
      }, 500);

      // Render Menu
      const menuHandler = MenuHandler.getInstance(cssUriMenu, svgObjectMenu);
      menuHandler.initialize();
      MenuHandler.eventListener.addListener(updateWebView);

      // Retrieve all saved canvases
      let canvases: any[] = context.workspaceState.get("canvases") || [];
      menuHandler.setCanvases(canvases);

      menuPanel.webview.html = menuHandler.webViewContent();

      // Track Application instances per canvas
      const appInstances: Record<string, Application> = {};

      // Listen for menu events
      menuPanel.webview.onDidReceiveMessage((message) => {
        const command = message.command;
        menuCommandHandler(command, message, context, canvases, appInstances);
      });

      menuPanel.onDidDispose(() => {}, null, context.subscriptions);
    },
  );

  // =====================================
  // ========== CANVAS WEBVIEW ===========
  // =====================================

  //TODO: Refactor to match launchMenu’s canvas logic

  // const updateShapesGlobal = debounce((shapes: ShapeData[]) => {
  //   try {
  //     context.workspaceState.update("shapes", shapes);
  //   } catch (e) {
  //     console.error(e);
  //     vscode.window.showErrorMessage(
  //       "An error occurred while saving shapes. Please try again.",
  //     );
  //   }
  // }, 500);

  // const open = vscode.commands.registerCommand("projectmapper.open", () => {
  //   // Currently commented-out, can be refactored to match launchMenu’s canvas logic
  //   const panel = vscode.window.createWebviewPanel(
  //     "projectMapper",
  //     "Project-Mapper",
  //     vscode.ViewColumn.One,
  //     {
  //       enableScripts: true,
  //       retainContextWhenHidden: true,
  //       localResourceRoots: [
  //         resourceUri("src/styles"),
  //         resourceUri("src/icons"),
  //         resourceUri("src/App"),
  //       ],
  //     },
  //   );

  // });

  // Register commands
  // context.subscriptions.push(open);
  context.subscriptions.push(launchMenu);
}

/**
 * Called when the extension is deactivated.
 */
export function deactivate() {}
