import * as vscode from "vscode";
import path from "path";
import { svgResources } from "../App/types";

/**
 * Generates a file URI for a given relative path within the extension's directory.
 *
 * @param relativePath - The path to the file relative to the extension's root directory.
 * @returns A vscode.Uri object representing the file URI.
 */
const resourceUri = (
  relativePath: string,
  context: vscode.ExtensionContext,
) => {
  return vscode.Uri.file(path.join(context.extensionPath, relativePath));
};

/**
 * Creates a URI that can be used in the webview to refer to a file
 * in the extension's directory.
 *
 * @param panel The webview panel.
 * @param relativePath The path to the file within the extension's directory.
 * @returns The URI.
 */
const webViewUri = (
  panel: vscode.WebviewPanel,
  relativePath: string,
  context: vscode.ExtensionContext,
) => {
  return panel.webview.asWebviewUri(
    vscode.Uri.file(path.join(context.extensionPath, relativePath)),
  );
};

/**
 * Generates an object with URIs for all SVG resources in the extension's icon directory.
 * The object has the same keys as the svgResources array, with each key mapped to a URI
 * that can be used in the webview to refer to the corresponding SVG file.
 *
 * @param panel The webview panel.
 * @returns An object with URIs for all SVG resources.
 */

const createSvgObject = (
  panel: vscode.WebviewPanel,
  context: vscode.ExtensionContext,
) =>
  svgResources.reduce(
    (list, item) => {
      list[item] = webViewUri(
        panel,
        `src/icons/${item}.svg`,
        context,
      ).toString();
      return list;
    },
    {} as { [key: string]: string },
  );

export { resourceUri, webViewUri, createSvgObject };
