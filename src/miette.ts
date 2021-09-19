import { IError } from "./types";
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
        error: this,
        source: source,
        message: this.message,
        snippets: this.snippets,
        diagnostic: this.diagnostic,
      });
    };
  };
}

export function MietteError(error: IError): void {
  const diagnostic = new Diagnostic(error);
  const reporter = new GraphicalReportHandler(diagnostic);

  reporter.render();
}
