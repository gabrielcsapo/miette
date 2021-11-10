import { Chalk } from "chalk";
import { Diagnostic } from "./diagnostic";
import { ILine, IThemeStyle, IThemeCharacters } from "./types";
export declare class Reporter {
    theme: {
        style: IThemeStyle;
        characters: IThemeCharacters;
    };
    diagnostic: Diagnostic;
    debugString: string;
    constructor(diagnostic: Diagnostic, style: IThemeStyle, characters: IThemeCharacters);
    write(str: string): void;
    writeLine(str: string): void;
    severityStyle(): Chalk;
    getLines(str: string): ILine[];
    render(): void;
    render_header(): void;
    render_cause(): void;
    render_snippets(): void;
    render_footer(): void;
}
//# sourceMappingURL=reporter.d.ts.map