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
      <div>
    <div id="canvas-${canvas.id}" class="mx-4 rounded-lg p-5 relative canvas-item"
         onclick="handleButtonClick('openCanvas', { canvasId: '${canvas.id}' })">
         <!-- Canvas content can be rendered here using canvas data -->
    </div>
<p class="ml-5 pl-2 mt-3 text-stone-100">DATE test test test</p>
<p class="ml-5 pl-2 text-stone-800 font-size-md font-semibold mt-1">NAME test test test</p>
    </div>
  `).join("");


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
      </script>
      <body>
      <div class="grid-background h-screen mx-4 rounded-lg p-5 relative">
        <div class="grid grid-cols-1 items-center">
          <div class="flex justify-between items-center my-5">    
              <button
                class="button-add mx-1 rounded-full flex items-center justify-center"
              >
                <img
                  src="${svgObject.plus}"
                  alt="Add"
                  style="width: 70%; height: 70%;"
                  onclick="handleButtonClick('createCanvas')"
                />
              </button>
            </div>
              <div class="grid grid-cols-3 gap-4 my-5">
                ${canvasContent}
              </div>
              </div>
        </div>
      </body>
    </html>`;
}

export { getMenuViewContent };

