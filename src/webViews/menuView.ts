import {  Button } from "../App/toolBar";
import * as vscode from "vscode";


function getMenuViewContent(cssUri: vscode.Uri, svgObject: any, canvases: any): string {

  const canvasContent = canvases.map((canvas: any) => {
    return `<div class=" h-50 w-50 mx-4 rounded-lg p-5 relative bg-blue-500">
              <!-- Canvas content can be rendered here using canvas data -->
            </div>`;

  }).join("");


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
        function handleButtonClick(command) {
          vscode.postMessage({ command });
        }
      </script>
      <body>
        <div class="grid-background h-screen mx-4 rounded-lg p-5 relative">
                    <div class="flex justify-between items-center mb-4">    
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
              <div>
                ${canvasContent}
              </div>
              </div>
      </body>
    </html>`;
}

export { getMenuViewContent };

