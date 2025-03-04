
abstract class Button {

    constructor(
        public iconPath: string,
        public type: string,
        public name: string 
    ) {}

    createButton() {}
    removeButton() {}
}
class ShapeButton extends Button {

    constructor(
        public iconPath: string,
        public type: string,
        public name: string 
    ) {
        super(iconPath, type, name);
    }

    createButton(){
        switch(this.type) {
            case "fill":
                return `<button id="button-${this.name}" class="mx-1 rounded-full flex items-center justify-center"><img src="${this.iconPath}" alt="${this.name}" style="width: 70%; height: 70%;"></button>`;
            case "outline":
                return `<button id="button-${this.name}" class="mx-1" id="${this.name}">${this.name}</button>`;
            }
    }
}


export {ShapeButton};