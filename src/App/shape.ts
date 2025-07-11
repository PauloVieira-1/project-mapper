import { ColorType } from "./types";

interface Shape {
  length: number;
  width: number;
  id: number;
  color: ColorType;
  render(): string;
  setColor(color: ColorType): void;
  move(x: number, y: number): void;
}

class Square implements Shape {
  constructor(
    public length: number,
    public width: number,
    public x: number,
    public y: number,
    public id: number,
    public color: ColorType
  ) {}

  render() {
    return `
      <div class="shape-group" id="shape-group-${this.id}" style="position:absolute; left:${this.x}px; top:${this.y}px;">
        <div id="shape-${this.id}"
             style="
               width:${this.length}px;
               height:${this.width}px;
               background:${this.color};
               border-radius:5px;
               cursor:grab;
               position:relative;
               z-index: 2;
             "
             onmousedown="startDrag(event, ${this.id})"
             onclick="vscode.postMessage({command: 'color', text: 'Square', id: ${this.id}})">
        </div>
        <div class="delete-button"
             onclick="event.stopPropagation(); vscode.postMessage({command: 'Remove', text: 'Square', id: ${this.id}})">
          ×
        </div>
      </div>
    `;
  }

  setColor(color: ColorType) {
    this.color = color;
  }

  move(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Triangle implements Shape {
  constructor(
    public length: number,
    public width: number,
    public x: number,
    public y: number,
    public id: number,
    public color: ColorType
  ) {}

  render() {
    return `
      <div class="shape-group" id="shape-group-${this.id}" style="position:absolute; left:${this.x}px; top:${this.y}px;">
        <div id="shape-${this.id}"
             style="
               width: 0;
               height: 0;
               border-left: ${this.length / 2}px solid transparent;
               border-right: ${this.length / 2}px solid transparent;
               border-bottom: ${this.width}px solid ${this.color};
               cursor: grab;
               position: relative;
               z-index: 2;
             "
             onmousedown="startDrag(event, ${this.id})"
             onclick="vscode.postMessage({command: 'color', text: 'Triangle', id: ${this.id}})">
        </div>
        <div class="delete-button"
             onclick="event.stopPropagation(); vscode.postMessage({command: 'Remove', text: 'Triangle', id: ${this.id}})">
          ×
        </div>
      </div>
    `;
  }

  setColor(color: ColorType) {
    this.color = color;
  }

  move(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Circle implements Shape {
  constructor(
    public length: number,
    public width: number,
    public x: number,
    public y: number,
    public id: number,
    public color: ColorType
  ) {}

  render() {
    return `
      <div class="shape-group" id="shape-group-${this.id}" style="position:absolute; left:${this.x}px; top:${this.y}px;">
        <div id="shape-${this.id}"
             style="
               width:${this.length}px;
               height:${this.width}px;
               background:${this.color};
               border-radius:50%;
               cursor:grab;
               position: relative;
               z-index: 2;
             "
             onmousedown="startDrag(event, ${this.id})"
             onclick="vscode.postMessage({command: 'color', text: 'Circle', id: ${this.id}})">
        </div>
        <div class="delete-button"
             onclick="event.stopPropagation(); vscode.postMessage({command: 'Remove', text: 'Circle', id: ${this.id}})">
          ×
        </div>
      </div>
    `;
  }

  setColor(color: ColorType) {
    this.color = color;
  }

  move(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export { Shape, Square, Triangle, Circle };
