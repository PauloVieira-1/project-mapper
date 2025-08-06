// src/App/shapeCommandHandler.ts
import * as vscode from "vscode";
import { Application } from "./application";
import {
  ColorType,
  CommandType,
  ShapeData,
} from "./types";
import { idGenerator, getNextEnumValue, isShapeMessage } from "./helpers";

export function handleShapeCommand(
  message: any,
  app: Application,
  shapes: ShapeData[],
  updateShapes: (shapes: ShapeData[]) => void,
  saveState: () => void
) {
  if (!isShapeMessage(message)) {
    vscode.window.showErrorMessage("Invalid message received");
    return shapes;
  }

  switch (message.command) {
    case CommandType.AddShape: {
      const shapeId = idGenerator();

      app.canvas.addShape(
        app.createShape(
          message.text,
          shapeId,
          ColorType.DarkBlue,
          ColorType.Green,
          { x: 0, y: 0 },
          { length: 100, width: 100 }
        )
      );

      const newShapes = [
        ...shapes,
        {
          shape: message.text,
          id: shapeId,
          color: ColorType.DarkBlue,
          nextColor: ColorType.Green,
          coordinates: { x: 0, y: 0 },
          dimensions: { length: 100, width: 100 },
        },
      ];
      updateShapes(newShapes);
      saveState();
      return newShapes;
    }

    case CommandType.RemoveShape: {
      const updatedShapes = shapes.filter(
        (shape) => shape.id !== message.id
      );
      app.canvas.removeShape(message.id);
      updateShapes(updatedShapes);
      saveState();
      return updatedShapes;
    }

    case CommandType.ChangeColor: {
      const shapeToColor = app.canvas.getShapes().find((shape) => shape.id === message.id);
      if (shapeToColor) {
        const newColor = getNextEnumValue(shapeToColor.color);
        const newNextColor = getNextEnumValue(newColor);

        app.canvas.changeColor(shapeToColor.id, newColor, newNextColor);

        const recoloredShapes = shapes.map((shape) =>
          shape.id === message.id
            ? { ...shape, color: newColor, nextColor: newNextColor }
            : shape
        );
        updateShapes(recoloredShapes);
        saveState();
        return recoloredShapes;
      }
      return shapes;
    }

    case CommandType.MoveShape: {
      app.canvas.moveShape(message.id, message.translateX, message.translateY);

      const movedShapes = shapes.map((shape) =>
        shape.id === message.id
          ? {
              ...shape,
              coordinates: {
                x: message.translateX,
                y: message.translateY,
              },
            }
          : shape
      );
      updateShapes(movedShapes);
      saveState();
      return movedShapes;
    }

    case CommandType.resizeShape: {
      app.canvas.resizeShape(message.id, message.width, message.height);

      const resizedShapes = shapes.map((shape) =>
        shape.id === message.id
          ? {
              ...shape,
              dimensions: {
                length: message.width,
                width: message.height,
              },
            }
          : shape
      );
      updateShapes(resizedShapes);
      saveState();
      return resizedShapes;
    }

    case CommandType.Clear:
      updateShapes([]);
      app.setUpCanvas([]);
      saveState();
      return [];

    case CommandType.undo:
      app.caretaker.undo(app.canvas);
      return shapes;

    case CommandType.redo:
      app.caretaker.redo(app.canvas);
      return shapes;

    case CommandType.download:
      vscode.window.showInformationMessage("Downloading shapes as PDF...");
      app.downloadShapes();
      return shapes;

    default:
      return shapes;
  }
}
