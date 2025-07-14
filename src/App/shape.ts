import { ColorType } from "./types";

interface Shape {
  length: number;
  width: number;
  id: number;
  color: ColorType;
  nextColor: ColorType;
  render(): string;
  setColor(color: ColorType, nextColor: ColorType): void;
  move(x: number, y: number): void;
  resize(length: number, width: number): void;
  clone(): Shape;
}

class Square implements Shape {
  constructor(
    public length: number,
    public width: number,
    public x: number,
    public y: number,
    public id: number,
    public color: ColorType,
    public nextColor: ColorType,
  ) {}

  render() {
    return `
      <div class="shape-group" id="shape-group-${this.id}" style="left:${this.x}px; top:${this.y}px;">
        <div class="shape-container">
          <div id="shape-${this.id}" class="shape"
               style="width:${this.length}px; height:${this.width}px; background:${this.color};"
               onmousedown="startDrag(event, ${this.id})">
            <div class="next-color-indicator"
                 onclick="event.stopPropagation(); vscode.postMessage({command: 'nextColor', id: ${this.id}})"
                 style="background: ${this.nextColor};"></div>
          </div>
          <div class="resize-handle right" onmousedown="startResize(event, ${this.id}, 'right')" ></div>
          <div class="resize-handle bottom" onmousedown="startResize(event, ${this.id}, 'bottom')"></div>
          <div class="resize-handle corner" onmousedown="startResize(event, ${this.id}, 'corner')"></div>
          <div class="delete-button"
               onclick="event.stopPropagation(); vscode.postMessage({command: 'Remove', text: 'Square', id: ${this.id}})">×</div>
        </div>
      </div>
    `;
  }

  setColor(color: ColorType, nextColor: ColorType) {
    this.color = color;
    this.nextColor = nextColor;
  }

  move(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  clone(): Shape {
    return new Square(
      this.length,
      this.width,
      this.x,
      this.y,
      this.id,
      this.color,
      this.nextColor,
    );
  }

  resize(length: number, width: number) {
    this.length = length;
    this.width = width;
  }
}

class Triangle implements Shape {
  constructor(
    public length: number,
    public width: number,
    public x: number,
    public y: number,
    public id: number,
    public color: ColorType,
    public nextColor: ColorType,
  ) {}

  render() {
    return `
    <div class="shape-group" id="shape-group-${this.id}" style="left:${this.x}px; top:${this.y}px;">
      <div class="shape-container" style="position: relative;">
        <div class="next-color-indicator"
             onclick="event.stopPropagation(); vscode.postMessage({command: 'nextColor', id: ${this.id}})"
             style="
               position: absolute;
               top: -9px;
               left: -9px;
               width: 15px;
               height: 15px;
               border-radius: 50%;
               background: ${this.nextColor};
               z-index: 10;
             "></div>
        <div id="shape-${this.id}" class="triangle"
             style="
               width: 0;
               height: 0;
               border-left: ${this.length / 2}px solid transparent;
               border-right: ${this.length / 2}px solid transparent;
               border-bottom: ${this.width}px solid ${this.color};
             "
             onmousedown="startDrag(event, ${this.id})">
        </div>
        <div class="resize-handle right" onmousedown="startResize(event, ${this.id}, 'right')"></div>
        <div class="resize-handle bottom" onmousedown="startResize(event, ${this.id}, 'bottom')"></div>
        <div class="resize-handle corner" onmousedown="startResize(event, ${this.id}, 'corner')"></div>
        <div class="delete-button"
             onclick="event.stopPropagation(); vscode.postMessage({command: 'Remove', text: 'Triangle', id: ${this.id}}); ">×</div>
      </div>
    </div>
  `;
  }

  setColor(color: ColorType, nextColor: ColorType) {
    this.color = color;
    this.nextColor = nextColor;
  }

  move(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  clone(): Shape {
    return new Triangle(
      this.length,
      this.width,
      this.x,
      this.y,
      this.id,
      this.color,
      this.nextColor,
    );
  }

  resize(length: number, width: number) {
    this.length = length;
    this.width = width;
  }
}

class Circle implements Shape {
  constructor(
    public length: number,
    public width: number,
    public x: number,
    public y: number,
    public id: number,
    public color: ColorType,
    public nextColor: ColorType,
  ) {}

  render() {
    return `
      <div class="shape-group" id="shape-group-${this.id}" style="left:${this.x}px; top:${this.y}px;">
        <div class="shape-container">
          <div id="shape-${this.id}" class="shape circle"
               style="width:${this.length}px; height:${this.width}px; background:${this.color}; border-radius:50%;"
               onmousedown="startDrag(event, ${this.id})">
            <div class="next-color-indicator"
                 onclick="event.stopPropagation(); vscode.postMessage({command: 'nextColor', id: ${this.id}}); "
                 style="background: ${this.nextColor}; top: -8px; left: -8px;"></div>
          </div>
          <div class="resize-handle right" onmousedown="startResize(event, ${this.id}, 'right')"></div>
          <div class="resize-handle bottom" onmousedown="startResize(event, ${this.id}, 'bottom')"></div>
          <div class="resize-handle corner" onmousedown="startResize(event, ${this.id}, 'corner')"></div>
          <div class="delete-button"
               onclick="event.stopPropagation(); vscode.postMessage({command: 'Remove', text: 'Circle', id: ${this.id}})">×</div>
        </div>
      </div>
    `;
  }

  setColor(color: ColorType, nextColor: ColorType) {
    this.color = color;
    this.nextColor = nextColor;
  }

  move(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  clone(): Shape {
    return new Circle(
      this.length,
      this.width,
      this.x,
      this.y,
      this.id,
      this.color,
      this.nextColor,
    );
  }

  resize(length: number, width: number) {
    this.length = length;
    this.width = width;
  }
}

export { Shape, Square, Triangle, Circle };
