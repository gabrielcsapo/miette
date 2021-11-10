declare interface Diagnostic {
    help?: string;
    code?: string;
    url?: string;
}

declare interface IError {
    diagnostic?: Diagnostic;
    severity?: Severity;
    error: TypeError | RangeError | EvalError;
    source: string;
    message?: string;
    snippets: ISnippet[];
}

declare interface ISnippet {
    context: string;
    highlight: string;
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

declare type Severity = "ERROR" | "WARNING" | "ADVICE";

export { }
