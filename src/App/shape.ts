import { ShapeButton } from "./toolBar";

abstract class Shape {
    constructor(
        public length: string,
        public width: string 
    ) {}

    createShape()
    {}
}

class Square extends Shape {
    constructor(
        public length: string,
        public width: string 
    ) {
        super(length, width);
    }
    createShape() {
        console.log("TEST");
    }
}

export { Shape, Square }