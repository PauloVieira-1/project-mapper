import { CreateShapeButton, CreateArrowButton, Button } from "./toolBar";
import getWebViewContent from "./webViewContent";
import { Shape } from "./shape";
import * as vscode from "vscode";
import { objectAlias, ShapeType } from "./types";
import { listeners, removeListener } from "process";


 class Application {
  private svgObject: objectAlias; 
  declare private squareButton: Button;
  declare private circleButton: Button;
  declare private triangleButton: Button;
  declare private arrowButton: Button;
  public canvas = new Canvas();

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
    
    this.squareButton = createDropDownButton(this.svgObject.square, ShapeType.Square);
    this.circleButton = createDropDownButton(this.svgObject.circle, ShapeType.Circle);
    this.triangleButton = createDropDownButton(this.svgObject.triangle, ShapeType.Triangle);
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

  setUpCanvas(objectArray : Shape[]) {
    this.canvas.setShapes(objectArray);
  }

  createShape(buttonName: string): Shape {
    switch (buttonName) {
      case ShapeType.Circle:
      case ShapeType.Triangle:
        return this.triangleButton.addShape(buttonName);
      case "Arrow":
        return this.arrowButton.addShape("arrow1");
      default:
        return this.squareButton.addShape(ShapeType.Square);
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

class ShapeManager {
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

class Canvas {
  private shapes: Shape[];
  public shapeManager = new ShapeManager();

  constructor (){
    this.shapes = [];
  }

  setShapes(shapes: Shape[]) {
    this.shapes = shapes;
    this.shapeManager.notifyListeners();
  }
  getShapes(): Shape[] {
    return [...this.shapes];
  }

  addShape(shape: Shape) {
    this.shapes.push(shape);
    this.shapeManager.notifyListeners();
  }

  removeShape(shape: Shape) {
    this.shapes = this.shapes.filter((s) => s !== shape);
    this.shapeManager.notifyListeners();
  }

}

class Memento {}

export { Application };