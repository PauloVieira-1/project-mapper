abstract class Shape {
  constructor(
    public length: string,
    public width: string,
  ) {}

  abstract render(): string;
}

class Square extends Shape {
  constructor(
    public length: string,
    public width: string,
  ) {
    super(length, width);
  }
  render() {
    return `
        <svg width="${this.length}" height="${this.width}">
          <rect x="0" y="0" width="${this.length}" height="${this.width}" fill="blue" rx="5" />
        </svg>
        
        `;
  }
}

class Triangle extends Shape {
  constructor(
    public length: any,
    public width: string,
  ) {
    super(length, width);
  }
  render() {
    const length = parseFloat(this.length);
    const width = parseFloat(this.width);
  
    return `
      <svg width="${length}" height="${width}" viewBox="0 0 ${length} ${width}">
        <polygon points="0,${width} ${length},${width} ${length / 2},0" fill="blue" stroke="black" stroke-width="2" />
      </svg>
    `;
  }
  
}

class Circle extends Shape {
  constructor(
    public length: string,
    public width: string,
  ) {
    super(length, width);
  }
  render() {
    return `
        <svg width="${this.length}" height="${this.width}">
          <circle cx="${this.length}" cy="${this.width}" r="${this.length}" fill="blue" />
        </svg>
        
        `;
  }
}

export { Shape, Square, Triangle, Circle };
