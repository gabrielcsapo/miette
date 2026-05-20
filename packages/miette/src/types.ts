import type { Painter } from "./ansi.js"

export type Severity = "ERROR" | "WARNING" | "ADVICE"

/**
 * A pointer into the source string. `span` is a half-open range
 * `[start, end)` of JS string indices (UTF-16 code units — the same units
 * `String#length`, `String#indexOf`, and most JS parsers report).
 * `label` is rendered next to the highlight.
 */
export interface Snippet {
  span: [start: number, end: number]
  label?: string
}

export interface DiagnosticMeta {
  code?: string
  help?: string
  url?: string
}

export interface DiagnosticInput {
  error: Error
  source: string
  snippets: Snippet[]
  /** Overrides `error.message` for the rendered cause. */
  message?: string
  diagnostic?: DiagnosticMeta
  severity?: Severity
  /**
   * Maximum depth to walk `Error.cause` chains. Defaults to `8`. Set to `0` to
   * suppress the chain entirely.
   */
  causeDepth?: number
  /**
   * Override the rendered theme. When omitted, miette picks `unicode()` or
   * `ascii()` based on the runtime's unicode support.
   */
  theme?: Theme
}

export interface Line {
  /** 0-based line number. */
  line_number: number
  /** Index of the first char of this line within the source (UTF-16 units). */
  offset: number
  /** Length of the line text, not including the terminating newline. */
  length: number
  /** Raw line text without newline. */
  text: string
}

export interface ThemeStyle {
  error: Painter
  warning: Painter
  advice: Painter
  code: Painter
  help: Painter
  filename: Painter
  highlights: Painter[]
}

export interface Theme {
  characters: ThemeCharacters
  styles: ThemeStyle
}

export interface ThemeCharacters {
  hbar: string
  vbar: string
  xbar: string
  vbar_break: string
  uarrow: string
  rarrow: string
  ltop: string
  mtop: string
  rtop: string
  lbot: string
  mbot: string
  rbot: string
  lbox: string
  rbox: string
  lcross: string
  rcross: string
  underbar: string
  underline: string
  fyi: string
  x: string
  warning: string
  point_right: string
}
