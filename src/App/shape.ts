abstract class Shape {
  constructor(
    public length: number,
    public width: number,
  ) {
    this.length = 100;
    this.width = 100;
  }

  abstract render(): string;
}

class Square extends Shape {
  constructor(
    public length: number,
    public width: number,
  ) {
    super(length, width);
  }
  render() {
    return `
      <div>
          <svg class="hover-target" width="${this.length + 10}" height="${this.width + 10}" viewBox="-10 -10 ${this.length + 22} ${this.width + 22}" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="${this.length}" height="${this.width}" rx="5" />
              <circle class="hidden-svg" cx="${this.length + 62}" cy="0" r="8" onclick="vscode.postMessage({command: 'Delete'})" /> 
          </svg>
      </div>

        `;
  }
}

class Triangle extends Shape {
  constructor(
    public length: number,
    public width: number,
  ) {
    super(length, width);
  }
  render() {
  
    return `
      <div>
          <svg class="hover-target" width="${this.length + 10}" height="${this.width + 10}" viewBox="-10 -10 ${this.length + 22} ${this.width + 22}" xmlns="http://www.w3.org/2000/svg">
              <polygon points="0,${this.width} ${this.length},${this.width} ${this.length / 2},0" stroke-width="2" />
              <circle class="hidden-svg" cx="${this.length + 62}" cy="0" r="8" />
          </svg>
      </div>
    `;
  }
  
}

class Circle extends Shape {
  constructor(
    public length: number,
    public width: number,
  ) {
    super(length, width);
  }
  render() {
    return `
          <div>
          <svg class="hover-target" width="${this.length + 10}" height="${this.width + 10}" viewBox="-10 -10 ${this.length + 22} ${this.width + 22}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${this.length / 2}" cy="${this.width / 2}" r="${this.length / 2}" />
              <circle class="hidden-svg" cx="${this.length + 62}" cy="0" r="8" />
          </svg>
          </div>
        `;
  }
}

export { Shape, Square, Triangle, Circle };
