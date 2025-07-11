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
             onmousedown="startDrag(event, ${this.id})">
             
             <div
               class="next-color-indicator"
               onclick="event.stopPropagation(); vscode.postMessage({command: 'nextColor', id: ${this.id}})"
               style="
                 width: 12px;
                 height: 12px;
                 background: ${this.nextColor};
                 border: 1px solid #333;
                 border-radius: 50%;
                 position: absolute;
                 top: 4px;
                 left: 4px;
                 z-index: 3;
                 cursor: pointer;
               "
             ></div>

        </div>
        <div class="delete-button"
             onclick="event.stopPropagation(); vscode.postMessage({command: 'Remove', text: 'Square', id: ${this.id}})">
          ×
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
             >
        </div>

        <div
          class="next-color-indicator"
          onclick="event.stopPropagation(); vscode.postMessage({command: 'nextColor', id: ${this.id}})"
          style="
            width: 12px;
            height: 12px;
            background: ${this.nextColor};
            border: 1px solid #333;
            border-radius: 50%;
            position: absolute;
            top: -8px;
            left: -8px;
            z-index: 3;
            cursor: pointer;
          "
        ></div>

        <div class="delete-button"
             onclick="event.stopPropagation(); vscode.postMessage({command: 'Remove', text: 'Triangle', id: ${this.id}})">
          ×
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
             >
        </div>

        <div
          class="next-color-indicator"
          onclick="event.stopPropagation(); vscode.postMessage({command: 'nextColor', id: ${this.id}})"
          style="
            width: 12px;
            height: 12px;
            background: ${this.nextColor};
            border: 1px solid #333;
            border-radius: 50%;
            position: absolute;
            top: -8px;
            left: -8px;
            z-index: 3;
            cursor: pointer;
          "
        ></div>

        <div class="delete-button"
             onclick="event.stopPropagation(); vscode.postMessage({command: 'Remove', text: 'Circle', id: ${this.id}})">
          ×
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
}

export { Shape, Square, Triangle, Circle };
