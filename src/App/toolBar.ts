import { Square } from "./shape";

abstract class Button {

    constructor(
        public iconPath: string,
        public functionType: string ,
        public name: string
    ) {}

    createButton() {}
    addShape() {}
}
class ShapeButton extends Button {

    constructor(
        public iconPath: string,
        public functionType: string,
        public name: string 
    ) {
        super(iconPath, functionType, name);
    }

    createButton(){
        switch(this.functionType) {
            case "fill":
                return `
                <a href="#">
                <div class="grid grid-cols-6 items-center" onClick="this.addShape()">
                <img class="col-span-1 ps-0" src="${this.iconPath}" alt="${this.name}" style="width: 80%; height: 80%;">
                <span class="col-span-4 pl-2 pr-0 font-semibold">${this.name}</span>
                </div>
                 </a>`;
            case "outline":
                return `<button id="button-add" class="mx-1 rounded-full flex items-center justify-center"><img src="${this.iconPath}" alt="${this.name}" style="width: 70%; height: 70%;"></button>`;
            }
    }

    addShape() {
        console.log("TEST");
        const shape = new Square("0", "0");
        shape.createShape();
    }



}

class ArrowButton extends Button {

    constructor(
        public iconPath: string,
        public functionType: string,
        public name: string 
    ) {
        super(iconPath, functionType, name);
    }

    createButton(){
        return `<button id="button-arrow" class="mx-1 rounded-full flex items-center justify-center"><img src="${this.iconPath}" alt="${this.name}" style="width: 70%; height: 70%;"></button>`;
    }

}






export {ShapeButton, ArrowButton};