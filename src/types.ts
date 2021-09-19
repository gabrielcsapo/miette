import { Chalk } from "chalk";
import { Diagnostic } from "./diagnostic";
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

export interface IThemeStyle {
  error: Chalk;
  warning: Chalk;
  advice: Chalk;
  code: Chalk;
  help: Chalk;
  filename: Chalk;
  highlights: Chalk[];
}
export interface ISnippet {
  context: string;
  highlight: string;
}

export interface ILine {
  line_number: number;
  offset: number;
  length: number;
  text: string;
}

export type Severity = "ERROR" | "WARNING" | "ADVICE";

export interface Diagnostic {
  code?: string;
  url?: string;
}
export interface IError {
  diagnostic: Diagnostic;
  severity?: Severity;
  error: TypeError | RangeError | EvalError;
  source: string;
  message: string;
  snippets: ISnippet[];
  help?: string;
}
