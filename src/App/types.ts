type objectAlias = Record<string, string>

enum ShapeType { 
  Square = "Square",
  Triangle = "Triangle",
  Circle = "Circle",
  Arrow = "Arrow",
}

enum ColorType {
  Orange = "#FE7743",
  LightBlue = "#273F4F",
  DarkBlue = "#447D9B",
  Grey = "#D7D7D7",
  White = "#FFFFFF",
}

enum CommandType {
  AddShape = "Add",
  Clear = "Clear",
  fill = "fill",
}

export { ShapeType, objectAlias, ColorType, CommandType };