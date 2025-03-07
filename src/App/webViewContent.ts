import * as vscode from "vscode";
import { CreateShapeButton, CreateArrowButton } from "./toolBar";

function getWebViewContent(cssUri: vscode.Uri, svgObject: any, webviewLogic: vscode.Uri) {

    const squareButton = new CreateShapeButton(svgObject.square, "fill", "Add Square").createButton();
    const circleButton = new CreateShapeButton(svgObject.circle, "fill", "Add Circle").createButton();
    const triangleButton = new CreateShapeButton(svgObject.triangle, "fill", "Add Triangle").createButton();
    const arrowButton = new CreateArrowButton(svgObject.arrow, "outline", "Arrow").createButton();

    const squareHtml = squareButton.render();
    const circleHtml = circleButton.render();
    const triangleHtml = triangleButton.render();
    const arrowHtml = arrowButton.render();
    
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Project-Mapper</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
        <link rel="stylesheet" type="text/css" href="${cssUri}">
    </head>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="module" src="${webviewLogic}"></script>
    <script>

      const vscode = acquireVsCodeApi();

      window.addEventListener('message', (event) => {

        const message = event.data; 
        let element = '';

        switch(message.name) {
          case 'Square':
          element = \`${squareHtml}\`;
            break;
        }

      if (element) {
        document.getElementById("container").insertAdjacentHTML("beforeend", element); 
      }
      })

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
        </div>
        </div>
    <div>
  <div id = "container">
  </div>
    </body>
    </html>`;
  }

  export default getWebViewContent;
