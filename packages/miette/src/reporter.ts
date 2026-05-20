import type { Painter } from "./ansi.js"
import type { Diagnostic } from "./diagnostic.js"
import type { Line, Snippet, ThemeCharacters, ThemeStyle } from "./types.js"

interface PositionedSnippet {
  lineNumber: number
  startCol: number
  endCol: number
  label?: string
  color: Painter
}

export class Reporter {
  private readonly diagnostic: Diagnostic
  private readonly style: ThemeStyle
  private readonly chars: ThemeCharacters
  private output = ""

  constructor(
    diagnostic: Diagnostic,
    style: ThemeStyle,
    chars: ThemeCharacters,
  ) {
    this.diagnostic = diagnostic
    this.style = style
    this.chars = chars
  }

  render(): string {
    this.output = ""
    this.renderHeader()
    this.renderCause()
    this.renderSnippets()
    this.renderFooter()
    this.renderCauseChain()
    return this.output
  }

  private writeLine(s: string): void {
    this.output += `${s}\n`
  }

  private severityStyle(): Painter {
    if (this.diagnostic.severity === "WARNING") return this.style.warning
    if (this.diagnostic.severity === "ADVICE") return this.style.advice
    return this.style.error
  }

  private renderHeader(): void {
    const codeStyle = this.style.code
    const name = this.diagnostic.functionName
    const text = this.diagnostic.url
      ? codeStyle(`${name} ( ${this.diagnostic.url} )`)
      : codeStyle(name)
    this.writeLine(`Error: ${text}`)
  }

  private renderCause(): void {
    const sev = this.severityStyle()
    this.writeLine("")
    this.writeLine(`   ${sev(`${this.chars.x} ${this.diagnostic.message}`)}`)
  }

  private renderFooter(): void {
    if (this.diagnostic.help) {
      this.writeLine("")
      this.writeLine(
        `${this.chars.fyi} ${this.style.help(this.diagnostic.help)}`,
      )
    }
    this.writeLine("")
  }

  private renderCauseChain(): void {
    const max = this.diagnostic.input.causeDepth ?? 8
    if (max <= 0) return
    let cause = this.diagnostic.cause
    let depth = 1
    while (cause && depth <= max) {
      const indent = "  ".repeat(depth)
      this.writeLine(
        `${indent}${this.chars.rarrow} caused by: ${this.style.advice(cause.message)}`,
      )
      const next = (cause as { cause?: unknown }).cause
      cause = next instanceof Error ? next : undefined
      depth++
    }
  }

  private renderSnippets(): void {
    if (this.diagnostic.snippets.length === 0) return

    const lines = splitLines(this.diagnostic.source)
    if (lines.length === 0) return

    const positioned = positionSnippets(
      this.diagnostic.snippets,
      lines,
      this.style.highlights,
    )
    if (positioned.length === 0) return

    this.writeLine("")
    const lineWidth = String(
      Math.max(...lines.map((l) => l.line_number)),
    ).length
    const gutter = " ".repeat(lineWidth + 2)

    const fileLoc = this.diagnostic.fileAndLineNumber
    const topBorder = `${gutter}${this.chars.ltop}${this.chars.hbar.repeat(3)}${
      fileLoc ? `[${fileLoc}]` : ""
    }`
    this.writeLine(topBorder)

    const byLine = new Map<number, PositionedSnippet[]>()
    for (const p of positioned) {
      const arr = byLine.get(p.lineNumber) ?? []
      arr.push(p)
      byLine.set(p.lineNumber, arr)
    }

    for (const line of lines) {
      const lineNumStr = String(line.line_number).padStart(lineWidth, " ")
      this.writeLine(` ${lineNumStr} ${this.chars.vbar} ${line.text}`)

      const snippetsHere = byLine.get(line.line_number)
      if (!snippetsHere || snippetsHere.length === 0) continue
      snippetsHere.sort((a, b) => a.startCol - b.startCol)

      const rowWidth = line.text.length
      const underlineRow: string[] = Array.from({ length: rowWidth }, () => " ")
      for (const snip of snippetsHere) {
        const w = Math.max(1, snip.endCol - snip.startCol)
        const mid = Math.floor(w / 2)
        for (let i = 0; i < w; i++) {
          underlineRow[snip.startCol + i] = snip.color(this.chars.hbar)
        }
        underlineRow[snip.startCol + mid] = snip.color(this.chars.mtop)
      }
      this.writeLine(
        `${gutter}${this.chars.vbar_break} ${underlineRow.join("")}`,
      )

      const remaining = [...snippetsHere]
      while (remaining.length > 0) {
        const row: string[] = Array.from({ length: rowWidth }, () => " ")
        for (let i = 0; i < remaining.length - 1; i++) {
          const snip = remaining[i]
          const w = Math.max(1, snip.endCol - snip.startCol)
          const mid = Math.floor(w / 2)
          row[snip.startCol + mid] = snip.color(this.chars.vbar)
        }
        const last = remaining[remaining.length - 1]
        const w = Math.max(1, last.endCol - last.startCol)
        const mid = Math.floor(w / 2)
        const labelText = last.label ?? ""
        const tail =
          this.chars.lbot +
          this.chars.underline.repeat(2) +
          (labelText ? ` ${labelText}` : "")
        row[last.startCol + mid] = last.color(tail)
        this.writeLine(`${gutter}${this.chars.vbar_break} ${row.join("")}`)
        remaining.pop()
      }
    }

    this.writeLine(`${gutter}${this.chars.lbot}${this.chars.hbar.repeat(3)}`)
  }
}

function splitLines(source: string): Line[] {
  const lines: Line[] = []
  let offset = 0
  let lineNumber = 0
  const parts = source.split("\n")
  const last =
    parts.length > 0 && parts[parts.length - 1] === ""
      ? parts.length - 1
      : parts.length
  for (let i = 0; i < last; i++) {
    const text = parts[i]
    lines.push({ line_number: lineNumber, offset, length: text.length, text })
    offset += text.length + 1
    lineNumber++
  }
  return lines
}

function positionSnippets(
  snippets: Snippet[],
  lines: Line[],
  palette: Painter[],
): PositionedSnippet[] {
  const result: PositionedSnippet[] = []
  snippets.forEach((snippet, idx) => {
    const [start, end] = snippet.span
    const line = lines.find(
      (l) => start >= l.offset && start < l.offset + l.length + 1,
    )
    if (!line) return
    const startCol = Math.max(0, start - line.offset)
    const endCol = Math.min(line.text.length, end - line.offset)
    if (endCol <= startCol) return
    result.push({
      lineNumber: line.line_number,
      startCol,
      endCol,
      label: snippet.label,
      color: palette[idx % palette.length],
    })
  })
  return result
}
