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
      <g id="shape-group-${this.id}" transform="translate(${this.x}, ${this.y})">
        <rect id="shape-${this.id}"
              x="0" y="0"
              width="${this.length}"
              height="${this.width}"
              rx="5"
              fill="${this.color}"
              onmousedown="startDrag(event, ${this.id})"
              onclick="vscode.postMessage({command: 'color', text: 'Square', id: ${this.id}})"
              style="cursor: grab;"
        />

        <g onclick="vscode.postMessage({command: 'Remove', text: 'Square', id: ${this.id}})" style="cursor: pointer;">
          <circle cx="${this.length + 10}" cy="10" r="8" fill="red" />
          <line x1="${this.length + 5}" y1="5" x2="${this.length + 15}" y2="15" stroke="white" stroke-width="2"/>
          <line x1="${this.length + 5}" y1="15" x2="${this.length + 15}" y2="5" stroke="white" stroke-width="2"/>
        </g>
      </g>
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
      <g id="shape-group-${this.id}" transform="translate(${this.x}, ${this.y})" style="cursor: grab;">
        <polygon
          points="0,${this.width} ${this.length},${this.width} ${this.length / 2},0"
          fill="${this.color}"
          onmousedown="startDrag(event, ${this.id})"
          onclick="vscode.postMessage({command: 'color', text: 'Triangle', id: ${this.id}})"
        />
        <g onclick="vscode.postMessage({command: 'Remove', text: 'Triangle', id: ${this.id}})" style="cursor: pointer;">
          <circle cx="${this.length + 10}" cy="10" r="8" fill="red" />
          <line x1="${this.length + 5}" y1="5" x2="${this.length + 15}" y2="15" stroke="white" stroke-width="2"/>
          <line x1="${this.length + 5}" y1="15" x2="${this.length + 15}" y2="5" stroke="white" stroke-width="2"/>
        </g>
      </g>
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
      <g id="shape-group-${this.id}" transform="translate(${this.x}, ${this.y})" style="cursor: grab;">
        <circle
          cx="${this.length / 2}"
          cy="${this.width / 2}"
          r="${this.length / 2}"
          fill="${this.color}"
          onmousedown="startDrag(event, ${this.id})"
          onclick="vscode.postMessage({command: 'color', text: 'Circle', id: ${this.id}})"
        />
        <g onclick="vscode.postMessage({command: 'Remove', text: 'Circle', id: ${this.id}})" style="cursor: pointer;">
          <circle cx="${this.length + 10}" cy="10" r="8" fill="red" />
          <line x1="${this.length + 5}" y1="5" x2="${this.length + 15}" y2="15" stroke="white" stroke-width="2"/>
          <line x1="${this.length + 5}" y1="15" x2="${this.length + 15}" y2="5" stroke="white" stroke-width="2"/>
        </g>
      </g>
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
