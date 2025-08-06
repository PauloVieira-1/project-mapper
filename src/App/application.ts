import { CreateShapeButton, CreateToolButton, Button } from "./toolBar";
import getWebViewContent from "../webViews/webViewContent";
import { Shape } from "./shape";
import * as vscode from "vscode";
import { objectAlias, ShapeType, ColorType, CommandType } from "./types";
import { jsPDF } from "jspdf"; 

interface WebViewContentOptions {
  squareButton: Button;
  circleButton: Button;
  triangleButton: Button;
  arrowButton: Button;
  trashButton: Button;
  undo: Button;
  redo: Button;
  download: Button;

}

interface ExtendedWebViewContentOptions extends WebViewContentOptions {
  undo: Button;
  redo: Button;
  download: Button;
}

class Application {
  private svgObject: objectAlias;
  declare private squareButton: Button;
  declare private circleButton: Button;
  declare private triangleButton: Button;
  declare private arrowButton: Button;
  declare private trashButton: Button;
  declare private redo: Button;
  declare private undo: Button;
  declare private download: Button;
  public canvas = new Canvas();
  public caretaker = new Caretaker();

  constructor(resources: objectAlias, panel: vscode.WebviewPanel) {
    this.svgObject = resources;
    this.initialize();
  }

  initialize() {
    this.setUpButtons();
  }

  setUpButtons() {
    const createDropDownButtonShape = (
      svgObject: string,
      shape: string,
    ): Button => {
      return new CreateShapeButton(
        svgObject,
        CommandType.fill,
        CommandType.AddShape,
        shape,
      ).createButton();
    };

    this.squareButton = createDropDownButtonShape(
      this.svgObject.square,
      ShapeType.Square,
    );
    this.circleButton = createDropDownButtonShape(
      this.svgObject.circle,
      ShapeType.Circle,
    );
    this.triangleButton = createDropDownButtonShape(
      this.svgObject.triangle,
      ShapeType.Triangle,
    );
    this.arrowButton = new CreateToolButton(
      this.svgObject.arrow,
      CommandType.fill,
      CommandType.AddShape,
      null,
    ).createButton();

    this.trashButton = new CreateToolButton(
      this.svgObject.trash,
      CommandType.fill,
      CommandType.Clear,
      null,
    ).createButton();

    const createDropDownButton = (
      svgObject: string,
      command: string,
    ): Button => {
      return new CreateShapeButton(
        svgObject,
        CommandType.fill,
        command,
        null,
      ).createButton();
    };

    this.undo = createDropDownButton(this.svgObject.undo, CommandType.undo);

    this.redo = createDropDownButton(this.svgObject.redo, CommandType.redo);

    this.download = createDropDownButton(
      this.svgObject.download,
      CommandType.download,
    );

    if (
      !this.squareButton ||
      !this.circleButton ||
      !this.triangleButton ||
      !this.arrowButton
    ) {
      throw new Error("Buttons not created");
    }
  }

  setUpCanvas(objectArray: Shape[]) {
    this.canvas.setShapes(objectArray);
  }

  createShape(
    shapeType: ShapeType,
    id: number,
    color: ColorType,
    nextColor: ColorType,
    { x, y }: { x: number; y: number },
    { length, width }: { length: number; width: number },
  ): Shape {
    switch (shapeType) {
      case ShapeType.Circle:
        return this.circleButton.addShape(
          shapeType,
          id,
          color,
          nextColor,
          { x, y },
          { length, width },
        );
      case ShapeType.Triangle:
        return this.triangleButton.addShape(
          shapeType,
          id,
          color,
          nextColor,
          { x, y },
          { length, width },
        );
      case ShapeType.Arrow:
        return this.arrowButton.addShape(
          shapeType,
          id,
          color,
          nextColor,
          { x, y },
          { length, width },
        );
      default:
        return this.squareButton.addShape(
          ShapeType.Square,
          id,
          color,
          nextColor,
          { x, y },
          { length, width },
        );
    }
  }

  webViewContent(cssUri: vscode.Uri, shapes: Shape[]) {
    return getWebViewContent(cssUri, this.svgObject, shapes, {
      squareButton: this.squareButton,
      circleButton: this.circleButton,
      triangleButton: this.triangleButton,
      arrowButton: this.arrowButton,
      trashButton: this.trashButton,
      undo: this.undo,
      redo: this.redo,
      download: this.download,
    } as WebViewContentOptions & ExtendedWebViewContentOptions);
  }

  createSnapshot() {
    return new Snapshot(this.canvas.getShapes());
  }

  saveState() {
    this.caretaker.add(this.createSnapshot());
  }

downloadShapes() {
  const shapes = this.canvas.getShapes(); 
  const doc = new jsPDF();

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  shapes.forEach((shape, index) => {
    const y = 10 + index * 10;
    doc.text(`Shape ${index + 1}: ${JSON.stringify(shape)}`, 10, y);
  });

  doc.save("canvas.pdf");
}

}

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

  constructor() {
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

  removeShape(id: number) {
    this.shapes = this.shapes.filter((s) => s.id !== id);
    this.shapeManager.notifyListeners();
  }

  changeColor(id: number, color: ColorType, nextColor: ColorType) {
    this.shapes = this.shapes.map((s) => {
      if (s.id === id) {
        s.setColor(color, nextColor);
      }
      return s;
    });
    this.shapeManager.notifyListeners();
  }

  moveShape(id: number, x: number, y: number) {
    this.shapes = this.shapes.map((s) => {
      if (s.id === id) {
        s.move(x, y);
      }
      return s;
    });
    this.shapeManager.notifyListeners();
  }

  resizeShape(id: number, length: number, width: number) {
    this.shapes = this.shapes.map((s) => {
      if (s.id === id) {
        s.resize(length, width);
      }
      return s;
    });
    this.shapeManager.notifyListeners();
  }
}

class Snapshot {
  private shapes: Shape[];

  constructor(shapes: Shape[]) {
    this.shapes = shapes.map((s) => s.clone());
  }

  restore(canvas: Canvas) {
    canvas.setShapes(this.shapes.map((s) => s.clone()));
  }

  getShapes(): Shape[] {
    return this.shapes.map((s) => s.clone());
  }
}

class Caretaker {
  private snapshots: Snapshot[] = [];

  add(snapshot: Snapshot) {
    this.snapshots.push(snapshot);
  }

  undo(canvas: Canvas) {
    if (this.snapshots.length > 1) {
      const snapshot = this.snapshots[this.snapshots.length - 2];
      if (snapshot) {
        snapshot.restore(canvas);
        this.snapshots.pop();
      }
    }
  }

  redo(canvas: Canvas) {
    if (this.snapshots.length > 0) {
      const snapshot = this.snapshots.pop();
      if (snapshot) {
        snapshot.restore(canvas);
        this.snapshots.push(snapshot);
      }
    }
  }

  getSnapshots() {
    return [...this.snapshots];
  }
}

export { Application };
