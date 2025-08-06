


function getMenuViewContent(cssUri: string, svgResources: string[]): string {
  
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
          .resize-handle {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 10px;
            height: 10px;
            cursor: se-resize;
          }
        </style>
      </head>

      <body>
        <div class="flex flex-row">
            TEST
        </div>
      </body>
    </html>`;
}

export { getMenuViewContent };

