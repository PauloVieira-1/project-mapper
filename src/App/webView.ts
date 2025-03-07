import { CreateShapeButton, CreateArrowButton, Button } from "./toolBar";
import getWebViewContent from "./webViewContent";
import * as vscode from "vscode";

declare function acquireVsCodeApi(): any;
declare var window: any;
declare var document: any;


class Application {

  private svgObject: any;
  private squareButton: Button | null;
  private circleButton: Button | null;
  private triangleButton: Button | null;
  private arrowButton: Button | null;

  constructor(resources: any) {

    this.svgObject = resources;
    this.squareButton = null;
    this.circleButton = null;
    this.triangleButton = null;
    this.arrowButton = null;

    this.initialize();

  }

  initialize(){
    this.setUpListeners();
    this.setUpButtons();
  }

  setUpListeners() {
    window.addEventListener('message', (event: any) => {
      const message = event.data; 
      let element = '';

      switch(message.name) {
        case 'Square':
          element = `${this.squareButton?.addShape()}`;
          break;
        default:
          return false;
      }
    });
  }

  setUpButtons(){
    this.squareButton = new CreateShapeButton(this.svgObject.square, "fill", "Add Square").createButton();
    this.circleButton = new CreateShapeButton(this.svgObject.circle, "fill", "Add Circle").createButton();
    this.triangleButton = new CreateShapeButton(this.svgObject.triangle, "fill", "Add Triangle").createButton();
    this.arrowButton = new CreateArrowButton(this.svgObject.arrow, "fill", "Add Arrow").createButton();
  }

  webViewContent(cssUri: vscode.Uri, webviewLogic: vscode.Uri) {
    const html = getWebViewContent(cssUri, this.svgObject, webviewLogic);
    return html;
  }

  start(){
    
    console.log("Application started");
  }

}

const squareHtml = new CreateShapeButton("square", "fill", "Add Square").createButton().render();
// const vscode = acquireVsCodeApi();

window.addEventListener('message', (event: any) => {

  const message = event.data; 
  let element = '';

  switch(message.name) {
    case 'Square':
    element = `${squareHtml}`;
      break;
  }

if (element) {
  document.getElementById("container").insertAdjacentHTML("beforeend", element); 
}
});

export default Application;
