import { getMenuViewContent } from "../../webViews/menuView";

class MenuHandler {
    private static instance: MenuHandler | null = null;
    private constructor(private cssUri: string | null, private svgResources: string[]) {}

    public static getInstance(cssUri: string, svgResources: string[]): MenuHandler {
        if (this.instance === null) {
            this.instance = new MenuHandler(cssUri, svgResources);
        }
        return this.instance;
    }

    webViewContent(): string {
        return getMenuViewContent(this.cssUri!, this.svgResources);
    }
}

export default MenuHandler;
