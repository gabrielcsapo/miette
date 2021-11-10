import { IError, Severity } from "./types";
export declare class Diagnostic {
    error: IError;
    constructor(error: IError);
    get message(): string;
    get help(): string | undefined;
    get functionName(): string | undefined;
    get code(): string | undefined;
    get url(): string | undefined;
    get snippets(): import("./types").ISnippet[];
    get fileAndLineNumber(): string;
    get source(): string;
    get severity(): Severity;
}
//# sourceMappingURL=diagnostic.d.ts.map