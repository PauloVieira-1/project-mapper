import { CreateShapeButton, CreateArrowButton, Button } from "./toolBar";
import getWebViewContent from "./webViewContent";
import { Shape } from "./shape";
import * as vscode from "vscode";

class Application {
  private svgObject: any;
  private squareButton: Button | null;
  private circleButton: Button | null;
  private triangleButton: Button | null;
  private arrowButton: Button | null;

  constructor(resources: any, panel: vscode.WebviewPanel) {
    this.svgObject = resources;
    this.squareButton = null;
    this.circleButton = null;
    this.triangleButton = null;
    this.arrowButton = null;
    this.initialize();
  }

  initialize() {
    this.setUpButtons();
  }

  setUpButtons() {
    this.squareButton = new CreateShapeButton(
      this.svgObject.square,
      "fill",
      "Add",
      "Square",
    ).createButton();
    this.circleButton = new CreateShapeButton(
      this.svgObject.circle,
      "fill",
      "Add",
      "Circle",
    ).createButton();
    this.triangleButton = new CreateShapeButton(
      this.svgObject.triangle,
      "fill",
      "Add",
      "Triangle",
    ).createButton();
    this.arrowButton = new CreateArrowButton(
      this.svgObject.arrow,
      "fill",
      "Add",
      "Arrow",
    ).createButton();

    if (
      !this.squareButton ||
      !this.circleButton ||
      !this.triangleButton ||
      !this.arrowButton
    ) {
      throw new Error("Buttons not created");
    }
  }
  createShape(buttonName: string) {
    switch (buttonName) {
      case "Square":
        return this.squareButton?.addShape();
      case "Circle":
        return this.circleButton?.addShape();
      case "Triangle":
        return this.triangleButton?.addShape();
      case "Arrow":
        return this.arrowButton?.addShape();
      default:
        console.error(`Unknown button: ${buttonName}`);
        return null;
    }
  }

  webViewContent(cssUri: vscode.Uri, shapes: Shape[]) {
    const html = getWebViewContent(cssUri, this.svgObject, shapes, {
      squareButton: this.squareButton,
      circleButton: this.circleButton,
      triangleButton: this.triangleButton,
      arrowButton: this.arrowButton,
    });
    return html;
  }

  start() {
    console.log("Application started");
  }
}

export default Application;
