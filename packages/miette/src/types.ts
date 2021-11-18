import { Chalk } from "chalk";

/**
 * @public
 */
export interface IThemeCharacters {
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

/**
 * @public
 */
export interface IThemeStyle {
  error: Chalk;
  warning: Chalk;
  advice: Chalk;
  code: Chalk;
  help: Chalk;
  filename: Chalk;
  highlights: Chalk[];
}

/**
 * @public
 */
export interface ISnippet {
  context: string;
  highlight: string;
}

/**
 * @public
 */
export interface ILine {
  line_number: number;
  offset: number;
  length: number;
  text: string;
}

/**
 * @public
 */
export type Severity = "ERROR" | "WARNING" | "ADVICE";

/**
 * @public
 */
export interface IDiagnostic {
  help?: string;
  code?: string;
  url?: string;
}

/**
 * @public
 */
export interface IError {
  diagnostic?: IDiagnostic;
  severity?: Severity;
  error: TypeError | RangeError | EvalError;
  source: string;
  message?: string; // message to override the default Error.message
  snippets: ISnippet[];
}
