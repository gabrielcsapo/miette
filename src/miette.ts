import { IError, ISnippet } from "./types";
import { GraphicalReportHandler } from "./renderer";
import { Diagnostic } from "./diagnostic";

export function miette(code: string, source: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/ban-types
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    const capturedStack = {};
    return class extends constructor {
      stackHolder = Error.captureStackTrace(capturedStack, this.constructor);

      name = code;
      stack = MietteError({
        // @ts-ignore
        error: this,
        source: source,
        // @ts-ignore
        message: this.message,
        // @ts-ignore
        snippets: this.snippets,
        // @ts-ignore
        diagnostic: this.diagnostic,
      });
    };
  };
}

export function MietteError(error: IError): string {
  const diagnostic = new Diagnostic(error);
  const reporter = new GraphicalReportHandler(diagnostic);

  reporter.render();

  return reporter.debugString;
}
