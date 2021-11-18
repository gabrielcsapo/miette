import { IError } from "./types";
import { Reporter } from "./reporter";
import { Diagnostic } from "./diagnostic";
import { Theme } from "./theme";

function isUnicodeSupported() {
  if (process.platform !== "win32") {
    return process.env.TERM !== "linux"; // Linux console (kernel)
  }

  return (
    Boolean(process.env.CI) ||
    Boolean(process.env.WT_SESSION) || // Windows Terminal
    process.env.ConEmuTask === "{cmd::Cmder}" || // ConEmu and cmder
    process.env.TERM_PROGRAM === "vscode" ||
    process.env.TERM === "xterm-256color" ||
    process.env.TERM === "alacritty"
  );
}

/**
 * Miette Decorator function to be used on Error
 * @public
 * @param code - error code
 * @param source - raw source that miette needs to annotate
 */
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

/**
 * @public
 * @param error - An instance of an error object to be used by the diagnostic reporter
 * @returns string to print to console
 */
export function MietteError(error: IError): string {
  const diagnostic = new Diagnostic(error);
  const reporter = new Reporter(
    diagnostic,
    isUnicodeSupported() ? Theme.unicode().styles : Theme.ascii().styles,
    isUnicodeSupported() ? Theme.unicode().characters : Theme.ascii().characters
  );

  reporter.render();

  return reporter.debugString;
}
