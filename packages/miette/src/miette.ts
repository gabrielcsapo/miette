import { supportsUnicode } from "./ansi.js"
import { Diagnostic } from "./diagnostic.js"
import { Reporter } from "./reporter.js"
import { ascii, unicode } from "./theme.js"
import type {
  DiagnosticInput,
  DiagnosticMeta,
  Severity,
  Snippet,
} from "./types.js"

/**
 * Format a diagnostic input into an ANSI-styled string.
 */
export function formatDiagnostic(input: DiagnosticInput): string {
  const theme = input.theme ?? (supportsUnicode() ? unicode() : ascii())
  const diagnostic = new Diagnostic(input)
  const reporter = new Reporter(diagnostic, theme.styles, theme.characters)
  return reporter.render()
}

export interface MietteErrorInit {
  source: string
  snippets: Snippet[]
  message?: string
  severity?: Severity
  diagnostic?: DiagnosticMeta
  cause?: Error
  /**
   * Maximum depth to walk `Error.cause` chains when rendering. Defaults to
   * `8`. Set to `0` to suppress the chain entirely.
   */
  causeDepth?: number
}

/**
 * An `Error` subclass that carries source-pointing snippets and renders
 * itself via `.format()`. Pass it anywhere a regular `Error` is expected.
 */
export class MietteError extends Error {
  readonly source: string
  readonly snippets: Snippet[]
  readonly severity: Severity
  readonly code?: string
  readonly help?: string
  readonly url?: string
  readonly causeDepth?: number

  constructor(init: MietteErrorInit) {
    super(
      init.message ?? "Diagnostic error",
      init.cause ? { cause: init.cause } : undefined,
    )
    this.name = init.diagnostic?.code ?? "MietteError"
    this.source = init.source
    this.snippets = init.snippets
    this.severity = init.severity ?? "ERROR"
    this.code = init.diagnostic?.code
    this.help = init.diagnostic?.help
    this.url = init.diagnostic?.url
    this.causeDepth = init.causeDepth
  }

  format(): string {
    return formatDiagnostic({
      error: this,
      source: this.source,
      snippets: this.snippets,
      severity: this.severity,
      causeDepth: this.causeDepth,
      diagnostic: { code: this.code, help: this.help, url: this.url },
    })
  }
}
