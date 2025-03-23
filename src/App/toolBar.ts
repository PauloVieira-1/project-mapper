import { Shape, Square, Triangle, Circle } from "./shape";
import { ShapeType } from "./types";


abstract class ButtonFactory {
  constructor(
    public iconPath: string,
    public functionType: string,
    public name: string,
    public text: string,
  ) {}

  abstract createButton(): Button;
}

class CreateShapeButton extends ButtonFactory {
  createButton(): Button {
    return new ShapeButton(
      this.iconPath,
      this.functionType,
      this.name,
      this.text,
    );
  }
}

class CreateArrowButton extends ButtonFactory {
  createButton(): Button {
    return new ArrowButton(
      this.iconPath,
      this.functionType,
      this.name,
      this.text,
    );
  }
}

abstract class Button {
  constructor(
    public iconPath: string,
    public functionType: string,
    public command: string,
    public text: string,
  ) {}

  abstract render(): string;
  abstract addShape(type: string, id: number): Shape;
}

class ShapeButton extends Button {
  constructor(
    public iconPath: string,
    public functionType: string,
    public command: string,
    public text: string,
  ) {
    super(iconPath, functionType, command, text);
  }

  render() {
    switch (this.functionType) {
      case "fill":
        return `
                <a href="#" onclick="vscode.postMessage({
                        command: '${this.command}',
                        text : '${this.text}'
                    })">
                <div class="grid grid-cols-6 items-center">
                <img class="col-span-1 ps-0" src="${this.iconPath}" alt="${this.command}" style="width: 80%; height: 80%;">
                <span class="col-span-4 pl-2 pr-0 font-semibold">${this.command} ${this.text}</span>
                </div>
                 </a>`;
      case "outline":
        return `<button id="button${this.command}" class="mx-1 rounded-full flex items-center justify-center button-add"><img src="${this.iconPath}" alt="${this.command}" style="width: 70%; height: 70%;"></button>`;
      default:
        return `<button id="button${this.command}" class="mx-1 rounded-full flex items-center justify-center button-add"><img src="${this.iconPath}" alt="${this.command}" style="width: 70%; height: 70%;"></button>`;
    }
  }


  addShape(type: string, id: number): Shape {
    switch (type) {
      case ShapeType.Circle:
        return new Circle(100, 100, id);
      case ShapeType.Triangle:
        return new Triangle(100, 100, id);
      default:
        return new Square(100, 100, id);
    }
  }
}

class ArrowButton extends Button {
  constructor(
    public iconPath: string,
    public functionType: string,
    public command: string,
    public text: string,
  ) {
    super(iconPath, functionType, command, text);
  }

  render() {
    return `<button onclick="vscode.postMessage({
                        command: 'Clear',
                    })" 
                    id="button-arrow" class="mx-1 rounded-full flex items-center justify-center"><img src="${this.iconPath}" alt="${this.command}" style="width: 70%; height: 70%;"></button>`;
  }

  addShape(type: string, id: number): Shape {
    return new Square(100, 100, id);
  }
}

export {
  ShapeButton,
  ArrowButton,
  CreateShapeButton,
  CreateArrowButton,
  Button,
};
