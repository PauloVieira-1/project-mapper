import { getMenuViewContent } from "../../webViews/menuView";
import { objectAlias } from "../types";
import * as vscode from "vscode";

class menuEventListener {
  declare private listeners: (() => void)[];

  constructor() {
    this.listeners = [];
  }

  addListener(listener: () => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: () => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }
}

class MenuHandler {
  private static instance: MenuHandler | null = null;
  public static eventListener: menuEventListener = new menuEventListener();
  private svgResources: objectAlias;
  private canvases: any[] = [];

  private constructor(
    private cssUri: vscode.Uri,
    private svgObject: objectAlias,
  ) {
    this.svgResources = svgObject;
  }

  public initialize() {}

  public static getInstance(
    cssUri: vscode.Uri,
    svgResources: objectAlias,
  ): MenuHandler {
    if (this.instance === null) {
      this.instance = new MenuHandler(cssUri, svgResources);
    }
    return this.instance;
  }

  webViewContent(): string {
    return getMenuViewContent(this.cssUri, this.svgResources, this.canvases);
  }

  public setCanvases(canvases: any[]) {
    this.canvases = canvases;
    MenuHandler.eventListener.notifyListeners();
  }

  public getCanvases(): any[] {
    return this.canvases;
  }

  public addCanvas(canvas: any) {
    this.canvases.push(canvas);
    MenuHandler.eventListener.notifyListeners();
  }

  public removeCanvas(id: string) {
    this.canvases = this.canvases.filter((c) => c.id !== id);
    MenuHandler.eventListener.notifyListeners();
  }
}

export default MenuHandler;
