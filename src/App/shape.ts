interface Shape {
  length: number;
  width: number;
  id: number;
  render(): string;
}

class Square implements Shape {
  constructor(
    public length: number,
    public width: number,
    public id: number, 
  ) {
  }
  render() {
    return `
      <div>
    <svg class="hover-target" width="${this.length + 50}" height="${this.width + 20}" 
         viewBox="-10 -10 ${this.length + 70} ${this.width + 20}" 
         xmlns="http://www.w3.org/2000/svg">
        
        <!-- Rectangle -->
        <rect x="0" y="0" width="${this.length}" height="${this.width}" rx="5" fill="none"/>

        <!-- Circle with 'X' -->
        <g class="hidden-svg" onclick="vscode.postMessage({command: 'Remove', text: 'Square', id: ${this.id}})">
            <circle class="" cx="${this.length + 5}" cy="0" r="8" />
            <line x1="${this.length + 1}" y1="-4" x2="${this.length + 9}" y2="4" stroke="white" stroke-width="2"/>
            <line x1="${this.length + 1}" y1="4" x2="${this.length + 9}" y2="-4" stroke="white" stroke-width="2"/>
        </g>

    </svg>
</div>


        `;
  } // Consider canvas 
}

class Triangle implements Shape {
  constructor(
    public length: number,
    public width: number,
    public id: number, 
  ) {
  }
  render() {
    return `
      <div>
          <svg class="hover-target" width="${this.length + 10}" height="${this.width + 10}" viewBox="-10 -10 ${this.length + 23} ${this.width + 23}" xmlns="http://www.w3.org/2000/svg">
              <polygon points="0,${this.width} ${this.length},${this.width} ${this.length / 2},0" stroke-width="2" />
        <!-- Circle with 'X' -->
        <g class="hidden-svg" onclick="vscode.postMessage({command: 'Remove', text: 'Square', id: ${this.id}})">
            <circle class="" cx="${this.length + 5}" cy="0" r="8" />
            <line x1="${this.length + 1}" y1="-4" x2="${this.length + 9}" y2="4" stroke="white" stroke-width="2"/>
            <line x1="${this.length + 1}" y1="4" x2="${this.length + 9}" y2="-4" stroke="white" stroke-width="2"/>
        </g>
              </svg>
      </div>
    `;
  }
}

class Circle implements Shape {
  constructor(
    public length: number,
    public width: number,
    public id: number, 
  ) {
  }
  render() {
    return `
          <div>
          <svg class="hover-target" width="${this.length + 10}" height="${this.width + 10}" viewBox="-10 -10 ${this.length + 25} ${this.width + 25}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${this.length / 2}" cy="${this.width / 2}" r="${this.length / 2}" />
        <!-- Circle with 'X' -->
        <g class="hidden-svg" onclick="vscode.postMessage({command: 'Remove', text: 'Square', id: ${this.id}})">
            <circle class="" cx="${this.length + 5}" cy="0" r="8" />
            <line x1="${this.length + 1}" y1="-4" x2="${this.length + 9}" y2="4" stroke="white" stroke-width="2"/>
            <line x1="${this.length + 1}" y1="4" x2="${this.length + 9}" y2="-4" stroke="white" stroke-width="2"/>
        </g>
          </svg>
          </div>
        `;
  }
}

export { Shape, Square, Triangle, Circle };
