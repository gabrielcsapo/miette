import { Chalk } from 'chalk';

export declare class Diagnostic {
    error: IError;
    constructor(error: IError);
    get message(): string;
    get help(): string | undefined;
    get functionName(): string | undefined;
    get code(): string | undefined;
    get url(): string | undefined;
    get snippets(): ISnippet[];
    get fileAndLineNumber(): string;
    get source(): string;
    get severity(): Severity;
}

export declare interface IDiagnostic {
    help?: string;
    code?: string;
    url?: string;
}

export declare interface IError {
    diagnostic?: IDiagnostic;
    severity?: Severity;
    error: TypeError | RangeError | EvalError;
    source: string;
    message?: string;
    snippets: ISnippet[];
}

export declare interface ILine {
    line_number: number;
    offset: number;
    length: number;
    text: string;
}

export declare interface ISnippet {
    context: string;
    highlight: string;
}

export declare interface IThemeCharacters {
    hbar: string;
    vbar: string;
    xbar: string;
    vbar_break: string;
    uarrow: string;
    rarrow: string;
    ltop: string;
    mtop: string;
    rtop: string;
    lbot: string;
    mbot: string;
    rbot: string;
    lbox: string;
    rbox: string;
    lcross: string;
    rcross: string;
    underbar: string;
    underline: string;
    fyi: string;
    x: string;
    warning: string;
    point_right: string;
}

export declare interface IThemeStyle {
    error: Chalk;
    warning: Chalk;
    advice: Chalk;
    code: Chalk;
    help: Chalk;
    filename: Chalk;
    highlights: Chalk[];
}

/**
 * Miette Decorator function to be used on Error
 * @param code - error code
 * @param source - raw source that miette needs to annotate
 * @returns
 * @example
 ```
 @miette(
 "foo::bar::baz",
 prettier.format(FooBarBaz.toString(), { parser: "babel" })
 )
 class ShouldBeFalseError extends Error {
 diagnostic = {
 help: "Please consult the guides at http://github.com/foo/bar#guides",
 };

 snippets = [
 {
 context: "if (true)",
 highlight: "This will always be called",
 },
 ];
 }
 ```
 */
export declare function miette(code: string, source: string): <T extends new (...args: any[]) => {}>(constructor: T) => {
    new (...args: any[]): {
        stackHolder: void;
        name: string;
        stack: string;
    };
} & T;

/**
 *
 * @param error
 * @returns
 */
export declare function MietteError(error: IError): string;

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

export declare type Severity = "ERROR" | "WARNING" | "ADVICE";

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

export declare const ThemeCharacters: {
    unicode(): IThemeCharacters;
    ascii(): IThemeCharacters;
};

export declare const ThemeStyle: IThemeStyle;

export { }
