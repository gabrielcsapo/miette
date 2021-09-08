export interface ISnippet {
  context: string;
  highlight: string;
}

export type Severity = "ERROR" | "WARNING" | "ADVICE";

export interface IError {
  severity?: Severity;
  error: TypeError | RangeError | EvalError;
  source: string;
  message: string;
  snippets: ISnippet[];
  help?: string;
}
