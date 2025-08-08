import * as vscode from "vscode";
import { canvasType } from "../App/types";

class FileListProvider implements vscode.TreeDataProvider<string> {
    private context: vscode.ExtensionContext;
    private static instance: FileListProvider | null = null;
    private canvases: canvasType[] = [];

    private constructor(context: vscode.ExtensionContext) {
        this.context = context;

    }

    public static getInstance(context: vscode.ExtensionContext) : FileListProvider {
        if (this.instance === null) {
            this.instance = new FileListProvider(context);
        }
        return this.instance;
    }

    private getCanvases(): canvasType[] {
        let canvases: canvasType[] = this.context.workspaceState.get("canvases") || [];
        return canvases;
    }

    getFiles(): string[] {
        return [];
    }

    getTreeItem(element: string): vscode.TreeItem  {
        const canvas = this.getCanvases().find((canvas) => canvas.name === element);
        if (!canvas) {
            return new vscode.TreeItem(element, vscode.TreeItemCollapsibleState.None);
        }
        const treeItem = new vscode.TreeItem(canvas.name, vscode.TreeItemCollapsibleState.None);
        treeItem.contextValue = "file";
        return treeItem;
    }

    getChildren(element?: string): Thenable<string[]> {
        return Promise.resolve(this.getFiles());
    }
}

export default FileListProvider;


