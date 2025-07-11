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
  Clear = "Clear",
  fill = "Fill",
  undo = "Undo",
  redo = "Redo",
  download = "Download",
}

export { ShapeType, objectAlias, ColorType, CommandType };
