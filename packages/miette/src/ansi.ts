const RESET = "\x1b[0m"

export type Painter = (s: string) => string

function colorSupported(): boolean {
  if (
    typeof globalThis !== "undefined" &&
    typeof (globalThis as { window?: unknown }).window !== "undefined"
  ) {
    return true
  }
  if (typeof process === "undefined") return false
  const env = process.env
  if (env.NO_COLOR) return false
  if (env.FORCE_COLOR === "0" || env.FORCE_COLOR === "false") return false
  if (env.FORCE_COLOR) return true
  return Boolean(
    process.stdout && (process.stdout as { isTTY?: boolean }).isTTY,
  )
}

function wrap(open: string): Painter {
  return (s: string) => (colorSupported() ? `${open}${s}${RESET}` : s)
}

export function rgb(r: number, g: number, b: number): Painter {
  return wrap(`\x1b[38;2;${r};${g};${b}m`)
}

export const bold: Painter = wrap("\x1b[1m")
export const underline: Painter = wrap("\x1b[4m")
export const dim: Painter = wrap("\x1b[2m")

export function compose(...painters: Painter[]): Painter {
  return (s: string) => painters.reduce((acc, p) => p(acc), s)
}

export function supportsUnicode(): boolean {
  if (
    typeof globalThis !== "undefined" &&
    typeof (globalThis as { window?: unknown }).window !== "undefined"
  ) {
    return true
  }
  if (typeof process === "undefined") return false
  if (process.platform !== "win32") return process.env.TERM !== "linux"
  return Boolean(
    process.env.CI ||
    process.env.WT_SESSION ||
    process.env.ConEmuTask === "{cmd::Cmder}" ||
    process.env.TERM_PROGRAM === "vscode" ||
    process.env.TERM === "xterm-256color" ||
    process.env.TERM === "alacritty",
  )
}
