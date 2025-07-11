import { Shape, Square, Triangle, Circle } from "./shape";
import { ShapeType, ColorType, CommandType } from "./types";

abstract class ButtonFactory {
  constructor(
    public iconPath: string,
    public functionType: string,
    public name: string,
    public text: string | null,
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

class CreateToolButton extends ButtonFactory {
  createButton(): Button {
    return new ToolButton(
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
    public text: string | null,
  ) {}

  abstract render(): string;
  abstract addShape(
    type: string,
    id: number,
    color: ColorType,
    coordinates: { x: number; y: number },
  ): Shape;
}

class ShapeButton extends Button {
  constructor(
    public iconPath: string,
    public functionType: string,
    public command: string,
    public text: string | null,
  ) {
    super(iconPath, functionType, command, text);
  }

  render() {
    switch (this.functionType) {
      case CommandType.fill:
        return `
                <a href="#" onclick="vscode.postMessage({
                        command: '${this.command}',
                        text : '${this.text}'
                    })">
                <div class="grid grid-cols-6 items-center">
                <img class="col-span-1 ps-0" src="${this.iconPath}" alt="${this.command}" style="width: 80%; height: 80%;">
                <span class="col-span-4 pl-2 pr-0 font-semibold">${this?.command} ${this.text ?? ""}</span>
                </div>
                 </a>`;
      case "outline":
        return `<button id="button${this.command}" class="mx-1 rounded-full flex items-center justify-center button-add"><img src="${this.iconPath}" alt="${this.command}" style="width: 55%; height: 55%;"></button>`;
      default:
        return `<button id="button${this.command}" class="mx-1 rounded-full flex items-center justify-center button-add"><img src="${this.iconPath}" alt="${this.command}" style="width: 55%; height: 55%;"></button>`;
    }
  }

  addShape(
    type: string,
    id: number,
    color: ColorType,
    coordinates: { x: number; y: number },
  ): Shape {
    const { x, y } = coordinates;
    switch (type) {
      case ShapeType.Circle:
        return new Circle(100, 100, x, y, id, color);
      case ShapeType.Triangle:
        return new Triangle(100, 100, x, y, id, color);
      default:
        return new Square(100, 100, x, y, id, color);
    }
  }
}

class ToolButton extends Button {
  constructor(
    public iconPath: string,
    public functionType: string,
    public command: string,
    public text: string | null,
  ) {
    super(iconPath, functionType, command, text);
  }

  render() {
    return `<button onclick="vscode.postMessage({
                        command: 'Clear',
                    })" 
                    id="button-arrow" class="mx-1 rounded-full flex items-center justify-center"><img src="${this.iconPath}" alt="${this.command}" style="width: 55%; height: 55%;"></button>`;
  }

  addShape(
    type: string,
    id: number,
    color: ColorType,
    coordinates: { x: number; y: number },
  ): Shape {
    const { x, y } = coordinates;
    return new Square(100, 100, x, y, id, color);
  }
}

export { ShapeButton, ToolButton, CreateShapeButton, CreateToolButton, Button };
