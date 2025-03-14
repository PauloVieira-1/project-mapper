```
```
# Project Mapper 

## Description
Project Mapper is a VS Code extension designed to create mind maps and UML diagrams to assist in project planning. The extension provides an intuitive interface within VS Code for visualizing project structures, organizing ideas, and mapping out dependencies efficiently.

## Features
- **Mind Mapping** – Create and edit dynamic mind maps to structure ideas.
- **UML Diagramming** – Design and manage UML diagrams for system planning.
- **Task Dependencies** – Define and visualize dependencies between tasks.
- **Integration with VS Code** – Seamlessly integrates into VS Code as an extension.
- **Data Persistence** – Save and load diagrams directly from the workspace.

## Technologies Used
- **Frontend:** TypeScript (VS Code Webview UI)
- **Backend:** Node.js (VS Code Extension API)
- **State Management:** VS Code workspaceState
- **Packaging & Deployment:** VS Code Extension Marketplace

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- VS Code (latest version)
- Node.js (>= 16.x)

### Clone the Repository
```sh
git clone https://github.com/PauloVieira-1/project-mapper.git
cd project-mapper
```

### Install Dependencies
```sh
npm install  
```

### Build & Run the Extension
```sh
npm run build
npm run package  # Packages the extension
code --install-extension project-mapper.vsix 
```

### Usage
- Open VS Code and navigate to the **Extensions** tab.
- Search for **Project Mapper** and install the extension (if published).
- Open the command palette (`Ctrl+Shift+P`) and run `Project Mapper: Launch`.
- Create a a diagram
- Organize ideas, define task dependencies, and visualize system structures.
- Save and load diagrams directly within your VS Code workspace.

## Future Development
- **Export & Import** – Support exporting diagrams as JSON, SVG, or PNG.
- **Real-Time Collaboration** – Enable live updates across multiple users.
- **Ability to Create Diagrams of different types** – User will bre created with diagram options upon launching

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
```
