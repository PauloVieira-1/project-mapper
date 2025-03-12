import { CreateShapeButton, CreateArrowButton, Button } from "./toolBar";
import getWebViewContent from "./webViewContent";
import { Shape } from "./shape";
import * as vscode from "vscode";

type objectAlias = Record<string, string>

enum ShapeType {
  Square = "Square",
  Triangle = "Triangle",
  Circle = "Circle",
}

 class Application {
  private svgObject: objectAlias; 
  private squareButton!: Button;
  private circleButton!: Button;
  private triangleButton!: Button;
  private arrowButton!: Button;
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

class Canvas {
  private shapes: Shape[];
  constructor (){
    this.shapes = [];
  }

  setShapes(shapes: Shape[]) {
    this.shapes = shapes;
  }
  getShapes(): Shape[] {
    return [...this.shapes];
  }

  addShape(shape: Shape) {
    this.shapes.push(shape);
  }

}


class Memento {}

export { Application, Canvas, ShapeType };