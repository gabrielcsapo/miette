import { IThemeCharacters, IThemeStyle } from "./types";
export declare const ThemeCharacters: {
    unicode(): IThemeCharacters;
    ascii(): IThemeCharacters;
};
export declare const ThemeStyle: IThemeStyle;
export declare const Theme: {
    ascii(): {
        characters: IThemeCharacters;
        styles: IThemeStyle;
    };
    unicode(): {
        characters: IThemeCharacters;
        styles: IThemeStyle;
    };
};
//# sourceMappingURL=theme.d.ts.map