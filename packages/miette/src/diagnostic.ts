import type { DiagnosticInput, Severity, Snippet } from "./types.js"

interface Frame {
  functionName?: string
  fileName?: string
  lineNumber?: number
  columnNumber?: number
}

const FRAME_RE = /^\s*at\s+(?:(.+?)\s+\()?(.+?):(\d+):(\d+)\)?\s*$/

function parseTopFrame(err: Error): Frame | undefined {
  if (!err.stack) return undefined
  for (const line of err.stack.split("\n").slice(1)) {
    const m = FRAME_RE.exec(line)
    if (m) {
      return {
        functionName: m[1] || undefined,
        fileName: m[2],
        lineNumber: Number(m[3]),
        columnNumber: Number(m[4]),
      }
    }
  }
  return undefined
}

export class Diagnostic {
  readonly input: DiagnosticInput
  private readonly frame: Frame | undefined

  constructor(input: DiagnosticInput) {
    this.input = input
    this.frame = parseTopFrame(input.error)
  }

  get message(): string {
    return this.input.message ?? this.input.error.message
  }

  get help(): string | undefined {
    return this.input.diagnostic?.help
  }

  get code(): string | undefined {
    return this.input.diagnostic?.code ?? this.input.error.name
  }

  get url(): string | undefined {
    return this.input.diagnostic?.url
  }

  get snippets(): Snippet[] {
    return this.input.snippets
  }

  get source(): string {
    const s = this.input.source
    return s.endsWith("\n") ? s : `${s}\n`
  }

  get severity(): Severity {
    return this.input.severity ?? "ERROR"
  }

  get functionName(): string {
    return this.input.error.name || this.frame?.functionName || "Error"
  }

  get fileAndLineNumber(): string | undefined {
    if (!this.frame?.fileName) return undefined
    const file = this.frame.fileName.split("/").pop() ?? this.frame.fileName
    return `${file}:${this.frame.lineNumber}:${this.frame.columnNumber}`
  }

  get cause(): Error | undefined {
    const c = (this.input.error as { cause?: unknown }).cause
    return c instanceof Error ? c : undefined
  }
}
