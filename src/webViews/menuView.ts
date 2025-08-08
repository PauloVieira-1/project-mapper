import * as vscode from "vscode";
import { canvasType } from "../App/types";

function getMenuViewContent(
  cssUri: vscode.Uri,
  svgObject: { [key: string]: string },
  canvases: canvasType[],
): string {
  const canvasContent = canvases
    .map(
      (canvas: canvasType) => `
      <div class="box-outline">
    <div id="canvas-${canvas.id}" class="rounded-lg p-5 relative canvas-item">
        <h1 id="remove" class="text-stone-800 font-size-lg font-semibold absolute top-2 right-2 mr-2 pointer" onclick="handleButtonClick('removeCanvas', { canvasId: '${canvas.id}' })">x</h1>
   <div class="flex items-center pointer h-full w-full mt-3" onclick="handleButtonClick('openCanvas', { canvasId: '${canvas.id}' })" > </div>
    </div>
    <p class="pl-2 mt-3 text-stone-100">${canvas.dateCreated}</p>
    <input class="pl-2 rounded-lg text-stone-800 bg-transparent font-size-md font-semibold mt-1" type="text" id="canvas-name-${canvas.id}" value="${canvas.name}" onchange="handleInputChange('renameCanvas', { canvasId: '${canvas.id}', name: this.value })" />
    </div>
  `,
    )
    .join("");

  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Project-Mapper</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        />
        <link rel="stylesheet" type="text/css" href="${cssUri}" />
        <style>
        

        </style>
      </head>
      <script>
        const vscode = acquireVsCodeApi();
        function handleButtonClick(command, data = {}) {
          vscode.postMessage({ command, ...data });
        }

        function handleInputChange(command, data = {}) {
          vscode.postMessage({ command, ...data });
        }

      </script> 
      <body>
      <div class="grid-background h-screen mx-4 rounded-lg p-5 relative">
        <div class="grid grid-cols-1 items-center">
          <div class="flex justify-between items-center my-5">    
              <button
                class="button-add mx-1 rounded-full flex items-center justify-center mb-2 mt-3"
              >
                <img
                  src="${svgObject.plus}"
                  alt="Add"
                  style="width: 70%; height: 70%;"
                  onclick="handleButtonClick('createCanvas')"
                />
              </button>
            </div>
              <div class="grid grid-cols-3 gap-6 my-5 pl-5 pr-5 overflow-container">
                ${canvasContent}
              </div>
              </div>
        </div>
      </body>
    </html>`;
}

export { getMenuViewContent };
