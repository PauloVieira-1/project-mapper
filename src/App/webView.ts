import { CreateShapeButton, CreateArrowButton, Button } from "./toolBar";
import { Square } from "./shape";
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

  constructor(resources: any, panel: vscode.WebviewPanel) {

    this.svgObject = resources;
    this.squareButton = null;
    this.circleButton = null;
    this.triangleButton = null;
    this.arrowButton = null;
    this.initialize();

  }

  initialize(){
    // this.setUpListeners();
    this.setUpButtons();
  }

  // setUpListeners() {
  //   window.addEventListener('message', (event: any) => {
  //     const message = event.data; 
  //     let element = '';

  //     switch(message.name) {
  //       case 'Square':
  //         element = `${this.squareButton?.addShape()}`;
  //         break;
  //       default:
  //         return false;
  //     }
  //   });
  // }

  setUpButtons(){
    this.squareButton = new CreateShapeButton(this.svgObject.square, "fill","Sqaure", "Add").createButton();
    this.circleButton = new CreateShapeButton(this.svgObject.circle, "fill", "Circle", "Add").createButton();
    this.triangleButton = new CreateShapeButton(this.svgObject.triangle, "fill", "Triangle", "Add").createButton();
    this.arrowButton = new CreateArrowButton(this.svgObject.arrow, "fill", "Arrow", "Add").createButton();

    if (!this.squareButton || !this.circleButton || !this.triangleButton || !this.arrowButton) {
      throw new Error("Buttons not created");
    }

  }

  webViewContent(cssUri: vscode.Uri) {
    const html = getWebViewContent(cssUri, this.svgObject, {
      squareButton: this.squareButton,
      circleButton: this.circleButton,
      triangleButton: this.triangleButton,
      arrowButton: this.arrowButton
    });
    return html;
  }

  start(){
    console.log("Application started");
  }

}

export default Application;