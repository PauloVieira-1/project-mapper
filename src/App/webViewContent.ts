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
    undo: Button;
    redo: Button;
    download: Button;
  },
) {
  const squareHtml = buttons.squareButton.render() ?? "";
  const circleHtml = buttons.circleButton.render() ?? "";
  const triangleHtml = buttons.triangleButton.render() ?? "";
  const arrowHtml = buttons.arrowButton.render() ?? "";
  const trashHtml = buttons.trashButton.render() ?? "";

  const undoHtml = buttons.undo.render() ?? "";
  const redoHtml = buttons.redo.render() ?? "";
  const downloadHtml = buttons.download.render() ?? "";

  const shapesHtml = shapes.map((shape) => shape.render()).join("");

  return html`<!DOCTYPE html>
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
  </head>

  <body>
    <div class="container mx-4 my-10">
      <h1 class="text-3xl font-bold my-5">Project-Mapper</h1>
      <a
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        href="https://github.com/PauloVieira-1/project-mapper"
        target="_blank"
        rel="noopener noreferrer"
      >
        Go to Github!
      </a>
    </div>

    <div class="grid-background h-screen mx-4 rounded-lg p-5 relative">
      <div
        id="button-menu"
        class="absolute top-0 right-0 mx-5 my-5 rounded-full px-1 py-2 flex items-center align-center"
      >
        <!-- Add Shapes Dropdown -->
        <div class="dropdown">
          <button
            class="dropbtn mx-1 rounded-full flex items-center justify-center"
          >
            <img
              src="${svgObject.plus}"
              alt="Add"
              style="width: 70%; height: 70%;"
            />
          </button>
          <div class="dropdown-content">
            ${squareHtml}
            ${circleHtml}
            ${triangleHtml}
          </div>
        </div>

        ${arrowHtml}
        ${trashHtml}

        <!-- Settings Dropdown -->
        <div class="dropdown">
          <button
            class="dropbtn mx-1 rounded-full flex items-center justify-center"
          >
            <img
              src="${svgObject.list}"
              alt="Settings"
              style="width: 70%; height: 70%;"
            />
          </button>
          <div class="dropdown-content">
            ${redoHtml}
            ${undoHtml}
            ${downloadHtml}
          </div>
        </div>
      </div>

      <div id="canvas">${shapesHtml}</div>
    </div>

    <script>
      const vscode = acquireVsCodeApi();

      console.log("Webview script loaded");

      let dragging = false;
      let currentShape = null;
      let offsetX = 0;
      let offsetY = 0;
      let lastX = 0;
      let lastY = 0;

      function startDrag(evt, id) {
        evt.preventDefault();
        currentShape = document.getElementById("shape-group-" + id);
        if (!currentShape) return;

        const rect = currentShape.getBoundingClientRect();
        offsetX = evt.clientX - rect.left;
        offsetY = evt.clientY - rect.top;

        dragging = true;

        document.addEventListener("mousemove", onDrag);
        document.addEventListener("mouseup", endDrag);
      }

      function onDrag(evt) {
        if (!dragging || !currentShape) return;

        const canvas = document.getElementById("canvas");
        const canvasRect = canvas.getBoundingClientRect();

        const newX = evt.clientX - canvasRect.left - offsetX;
        const newY = evt.clientY - canvasRect.top - offsetY;

        currentShape.style.left = newX + "px";
        currentShape.style.top = newY + "px";

        lastX = newX;
        lastY = newY;
      }

      function endDrag() {
        if (dragging && currentShape) {
          const id = currentShape.id.split("-")[2]; // shape-group-<id>

          vscode.postMessage({
            command: "Move",
            text: "Shape",
            id: parseInt(id),
            positionX: lastX,
            positionY: lastY,
            translateX: lastX,
            translateY: lastY,
          });
        }

        dragging = false;
        currentShape = null;
        document.removeEventListener("mousemove", onDrag);
        document.removeEventListener("mouseup", endDrag);
      }
    </script>
  </body>
</html>`;
}

export default getWebViewContent;
