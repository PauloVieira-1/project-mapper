
abstract class Shape {
    constructor(
        public length: string,
        public width: string 
    ) {}

    abstract render() : string
}

class Square extends Shape {
    constructor(
        public length: string,
        public width: string 
    ) {
        super(length, width);
    }
    render() {
        return `
        
        <div class="grid grid-cols-2 items-center">
        <span class="col-span-1 pl-2 pr-0 font-semibold">Length: ${this.length}</span>
        <span class="col-span-1 pl-2 pr-0 font-semibold">${this.width}</span>
        </div>
        
        `;
    }
}

export { Shape, Square };