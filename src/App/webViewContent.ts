import * as vscode from "vscode";
import { Shape } from "./shape";
import { Button } from "./toolBar";

const html = String.raw;

function getWebViewContent(
  cssUri: vscode.Uri,
  svgObject: any,
  shapes: Shape[],
  buttons: {
    squareButton: Button;
    circleButton: Button;
    triangleButton: Button;
    arrowButton: Button;
    trashButton: Button;
  },
) {
  const squareHtml =  buttons.squareButton.render() ?? "";
  const circleHtml =  buttons.circleButton.render() ?? "";
  const triangleHtml = buttons.triangleButton.render() ?? "";
  const arrowHtml = buttons.arrowButton.render() ?? "";
  const trashHtml = buttons.trashButton.render() ?? "";

  const shapesHtml = shapes
    .map((shape: Shape) => {
      return `<div >${shape.render()}</div>`;
    })
    .join("");

  return html`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Project-Mapper</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
        <link rel="stylesheet" type="text/css" href="${cssUri}">
    </head>
    <script>
  
      const vscode = acquireVsCodeApi();
      
        document.addEventListener("DOMContentLoaded", function () {
    const shape = document.getElementById("shape");

    if (shape) {
      shape.addEventListener("click", function () {
        console.log("SHAPE CLICKED!!");
      });
    } else {
      console.warn("Element with ID 'shape' not found.");
    }
  });

    </script>
    <body>
        <div class="container mx-4 my-10">
            <h1 class="text-3xl font-bold my-5">Project-Mapper</h1>
            <a class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
               href="https://github.com/PauloVieira-1/project-mapper" 
               target="_blank" rel="noopener noreferrer">
                Go to Github!
            </a>
        </div>
        <div class="grid-background h-screen mx-4 rounded-lg p-5 relative">
            <div id="button-menu" class="absolute top-0 right-0 mx-5 my-5 rounded-full px-1 py-2 flex items-center align-center"> 
              <div class="dropdown">
                <button id="dropbtn" class=" dropbtn mx-1 rounded-full flex items-center justify-center"><img src="${svgObject.plus}" alt="Add" style="width: 70%; height: 70%;"></button>
                <div class="dropdown-content">
                  ${squareHtml}
                  ${circleHtml}
                  ${triangleHtml}
                </div>
              </div>
              ${arrowHtml}
              ${trashHtml}
           </div>
           <div id = "container">
             ${shapesHtml}
           </div>
        </div>
    <div>
    </body>
    </html>`;
}

export default getWebViewContent;
