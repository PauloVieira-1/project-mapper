import { CreateShapeButton, CreateArrowButton, Button } from "./toolBar";
import getWebViewContent from "./webViewContent";
import { Shape } from "./shape";
import * as vscode from "vscode";

type objectAlias = Record<string, string>

export default class Application {
  private svgObject: objectAlias; 
  private squareButton!: Button;
  private circleButton!: Button;
  private triangleButton!: Button;
  private arrowButton!: Button;

  constructor(resources: objectAlias, panel: vscode.WebviewPanel) {
    this.svgObject = resources;
    this.initialize();
  }

  initialize() {
    this.setUpButtons();
  }

  setUpButtons() {
    const createDropDownButton = (svgObject : string, shape: string): Button => {
      return new CreateShapeButton(
        svgObject,
        "fill",
        "Add",
        shape
      ).createButton();
    };
    
    this.squareButton = createDropDownButton(this.svgObject.square, "Square");
    this.circleButton = createDropDownButton(this.svgObject.circle, "Circle");
    this.triangleButton = createDropDownButton(this.svgObject.triangle, "Triangle");
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
  createShape(buttonName: string): Shape {
    switch (buttonName) {
      case "Circle":
      case "Triangle":
        return this.triangleButton.addShape(buttonName);
      case "Arrow":
        return this.arrowButton.addShape("arrow1");
      default:
        return this.squareButton.addShape("Square");
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
};
