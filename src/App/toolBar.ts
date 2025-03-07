import { Shape, Square } from "./shape";


abstract class ButtonFactory {
    constructor(
        public iconPath: string,
        public functionType: string ,
        public name: string
    ) {}

    abstract createButton(): Button;
}

class CreateShapeButton extends ButtonFactory {
    createButton(): Button {
        return new ShapeButton(this.iconPath, this.functionType, this.name);
    }
}

class CreateArrowButton extends ButtonFactory {
    createButton(): Button {
        return new ArrowButton(this.iconPath, this.functionType, this.name);
    }
}

abstract class Button {

    constructor(
        public iconPath: string,
        public functionType: string,
        public name: string 
    ) {
    }

    abstract render(): string 
    abstract addShape(): string 
}

class ShapeButton extends Button {

    constructor(
        public iconPath: string,
        public functionType: string,
        public name: string 
    ) {
        super(iconPath, functionType, name);
    }

    render(){
        switch(this.functionType) {
            case "fill":
                return `
                <a href="#" onclick="vscode.postMessage({
                        command: '${this.name}'
                    })">
                <div class="grid grid-cols-6 items-center">
                <img class="col-span-1 ps-0" src="${this.iconPath}" alt="${this.name}" style="width: 80%; height: 80%;">
                <span class="col-span-4 pl-2 pr-0 font-semibold">${this.name}</span>
                </div>
                 </a>`;
            case "outline":
                return `<button id="button-add" class="mx-1 rounded-full flex items-center justify-center"><img src="${this.iconPath}" alt="${this.name}" style="width: 70%; height: 70%;"></button>`;
            default:
                return `<button id="button-add" class="mx-1 rounded-full flex items-center justify-center"><img src="${this.iconPath}" alt="${this.name}" style="width: 70%; height: 70%;"></button>`;
            }
        
    }

    addShape() {
        return new Square("100px", "100px").render();
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

    render(){
        return `<button id="button-arrow" class="mx-1 rounded-full flex items-center justify-center"><img src="${this.iconPath}" alt="${this.name}" style="width: 70%; height: 70%;"></button>`;
    }

    addShape() {
        return new Square("100px", "100px").render();
    }

}

export {ShapeButton, ArrowButton, CreateShapeButton, CreateArrowButton};