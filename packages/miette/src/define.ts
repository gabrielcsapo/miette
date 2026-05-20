import { MietteError } from "./miette.js"
import type { Severity, Snippet } from "./types.js"

type Render<Args,> = [Args] extends [never]
  ? string
  : string | (args: Args) => string

export interface DiagnosticDef<Args = never> {
  code?: Render<Args>
  severity?: Severity
  message: Render<Args>
  help?: Render<Args>
  url?: Render<Args>
}

export interface DefinedDiagnosticInit {
  source: string
  snippets: Snippet[]
  cause?: Error
  severity?: Severity
  causeDepth?: number
}

export interface DefinedDiagnosticInitWithArgs<Args>
  extendsDefinedDiagnosticInit {
  args: Args
}

export type DefinedDiagnostic<Args,> = [Args] extends [never]
  ? new (
    init: DefinedDiagnosticInit,
  ) => MietteError
  : new (
      init: DefinedDiagnosticInitWithArgs<Args>,
    ) => MietteError

/**
 * Declare a diagnostic shape once and reuse it across throw sites. The
 * runtime parallel of Rust miette's `#[derive(Diagnostic)]`: code, message,
 * help, and url are pinned to the definition; per-throw inputs carry the
 * source, snippets, and any interpolation `args`.
 *
 * @example
 *   const TS2345 = defineDiagnostic<{ actual: string; expected: string }>({
 *     code: "TS2345",
 *     message: ({ actual, expected }) =>
 *       `Argument of type '${actual}' is not assignable to '${expected}'.`,
 *     help: "Coerce one side, or change the parameter type.",
 *   });
 *
 *   throw new TS2345({
 *     source,
 *     snippets: [{ span: [85, 90], label: "string passed here" }],
 *     args: { actual: "string", expected: "number" },
 *   });
 */
export function defineDiagnostic<Args = never>(
  def: DiagnosticDef<Args>,
): DefinedDiagnostic<Args> {
  const resolveWith = (args: Args) => (v: unknown): string | undefined => {
    if (v === undefined) return undefined
    if (typeof v === "function") return v as (a: Args) => string(args)
    return v as string
  }

  class Defined extends MietteError {
    constructor(init: DefinedDiagnosticInit & { args?: Args }) {
      const resolve = resolveWith(init.args as Args)
      super({
        message: resolve(def.message)!,
        source: init.source,
        snippets: init.snippets,
        cause: init.cause,
        severity: init.severity ?? def.severity,
        causeDepth: init.causeDepth,
        diagnostic: {
          code: resolve(def.code),
          help: resolve(def.help),
          url: resolve(def.url),
        },
      })
    }
  }

  if (typeof def.code === "string") {
    Object.defineProperty(Defined, "name", { value: def.code })
  }

  return Defined as DefinedDiagnostic<Args>
}
