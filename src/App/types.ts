type objectAlias = Record<string, string>;

enum ShapeType {
  Square = "Square",
  Triangle = "Triangle",
  Circle = "Circle",
  Arrow = "Arrow",
}

enum ColorType {
  Red = "#ffb3ba",
  Orange = "#ffdfba",
  Yellow = "#ffffba",
  Green = "#baffc9",
  DarkBlue = "#bae1ff",
}

enum CommandType {
  AddShape = "Add",
  RemoveShape = "Remove",
  MoveShape = "Move",
  ChangeColor = "nextColor",
  saveState = "saveState",
  Clear = "Clear",
  fill = "Fill",
  undo = "Undo",
  redo = "Redo",
  download = "Download",
  resizeShape = "Resize",
}

const svgResources = [
  "plus",
  "arrow",
  "square",
  "triangle",
  "circle",
  "trash",
  "list",
  "redo",
  "undo",
  "download",
];

interface ShapeData {
  shape: ShapeType;
  id: number;
  color: ColorType;
  nextColor: ColorType;
  coordinates: { x: number; y: number };
  dimensions: { length: number; width: number };
}

export {
  ShapeType,
  objectAlias,
  ColorType,
  CommandType,
  svgResources,
  ShapeData,
};
