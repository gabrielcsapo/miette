import ErrorStackParser from "error-stack-parser";

import { IError, Severity } from "./types";

export class Diagnostic {
  error: IError;
  constructor(error: IError) {
    this.error = error;
  }

  get message() {
    return this.error.message;
  }

  get help(): string | undefined {
    return this.error.help;
  }

  get functionName() {
    if (this.error.error.name) return this.error.error.name;

    const parsedErrorStack = ErrorStackParser.parse(this.error.error);

    return parsedErrorStack[0].functionName;
  }

  get code(): string | undefined {
    return this.error.error.name;
  }

  get url(): string | undefined {
    return this.error.diagnostic?.url;
  }

  get snippets() {
    return this.error.snippets;
  }

  get fileAndLineNumber() {
    const parsedErrorStack = ErrorStackParser.parse(this.error.error);
    const lastStack = parsedErrorStack[0];

    return `${lastStack.fileName?.substring(
      lastStack.fileName.lastIndexOf("/") + 1,
      lastStack.fileName.length
    )}:${lastStack.lineNumber}:${lastStack.columnNumber}`;
  }

  get source() {
    return this.error.source;
  }

  get severity(): Severity {
    return this.error.severity || "ERROR";
  }
}
