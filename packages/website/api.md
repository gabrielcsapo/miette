---
title: API reference
outline: [2, 3]
---

# API reference

Every public export of `miette`. For prose-and-recipes see [Get started](/usage).

::: info Module shape
Single entry point. ESM and CJS both ship from `miette`:

```ts
import {
  formatDiagnostic,
  MietteError,
  defineDiagnostic,
  Diagnostic,
  Reporter,
  ascii,
  unicode,
} from "miette"
import type {
  DiagnosticInput,
  DiagnosticMeta,
  MietteErrorInit,
  DiagnosticDef,
  DefinedDiagnostic,
  DefinedDiagnosticInit,
  DefinedDiagnosticInitWithArgs,
  Snippet,
  Severity,
  Line,
  Theme,
  ThemeStyle,
  ThemeCharacters,
  Painter,
} from "miette"
```

:::

## At a glance

| Category    | Exports                                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Rendering   | [`formatDiagnostic`](#formatdiagnostic-input)                                                                                   |
| Errors      | [`MietteError`](#mietteerror), [`MietteErrorInit`](#mietteerrorinit)                                                            |
| Declarative | [`defineDiagnostic`](#definediagnostic-def), [`DiagnosticDef`](#diagnosticdef), [`DefinedDiagnostic`](#defineddiagnostic)       |
| Lower-level | [`Diagnostic`](#diagnostic), [`Reporter`](#reporter)                                                                            |
| Themes      | [`ascii`](#ascii), [`unicode`](#unicode), [`Theme`](#theme), [`ThemeStyle`](#themestyle), [`ThemeCharacters`](#themecharacters) |
| Input types | [`DiagnosticInput`](#diagnosticinput), [`Snippet`](#snippet), [`DiagnosticMeta`](#diagnosticmeta), [`Severity`](#severity)      |
| Misc types  | [`Line`](#line), [`Painter`](#painter)                                                                                          |
| Environment | [`NO_COLOR` and friends](#environment)                                                                                          |

## Functions

### `formatDiagnostic(input)`

```ts
function formatDiagnostic(input: DiagnosticInput): string
```

Renders an [`DiagnosticInput`](#diagnosticinput) to an ANSI-styled string.
Picks the [`unicode`](#unicode) theme when supported, falls back to
[`ascii`](#ascii) otherwise. No I/O — the return value is the entire output.

```ts
import { formatDiagnostic } from "miette"

const out = formatDiagnostic({
  error: new Error("oops"),
  source: "let x =",
  snippets: [{ span: [6, 7], label: "expected expression" }],
})
```

**Gotchas**

- `input.error` is required even if you also pass `message`. The error's `.name`,
  `.stack`, and `.cause` are all read.
- Snippets that fall outside the source are dropped silently. See
  [Anti-patterns](/usage#anti-patterns).
- Color and Unicode detection happen at call time, not at import time. Setting
  `NO_COLOR` after the module is loaded still works.

### `defineDiagnostic(def)`

```ts
function defineDiagnostic<Args = never>(
  def: DiagnosticDef<Args>,
): DefinedDiagnostic<Args>
```

Pin a diagnostic shape — `code`, `message`, `help`, `url`, default `severity` —
once, and reuse it across throw sites. The runtime analog of Rust miette's
`#[derive(Diagnostic)]`. The return value is a `MietteError` subclass whose
constructor takes only the _per-throw_ fields: `source`, `snippets`, and (if
your messages are functions) `args`.

```ts
import { defineDiagnostic } from "miette"

const TS2345 = defineDiagnostic<{ actual: string; expected: string }>({
  code: "TS2345",
  message: ({ actual, expected }) =>
    `Argument of type '${actual}' is not assignable to '${expected}'.`,
  help: ({ expected }) => `Pass a ${expected}, or change the parameter type.`,
})

throw new TS2345({
  source: 'divide(10, "two")',
  snippets: [{ span: [11, 16], label: "string passed here" }],
  args: { actual: "string", expected: "number" },
})
```

**Field notes**

- Any of `message`, `help`, `code`, `url` may be a `string` or a `(args) => string`.
  Mixing is fine — only the function-shaped ones consume `args`.
- If `Args` is omitted (the generic defaults to `never`), the constructor signature
  drops the `args` field, so callers don't pay for what they don't use.
- The returned class's `.name` is set to `def.code` (when provided) — that's what
  shows in stack traces and `Error: ...` headers.
- `init.severity` overrides `def.severity` per throw. Same for any caller-supplied
  field with the same name.
- `init.cause` is forwarded to `Error`'s constructor and walked by the renderer just
  like for [`MietteError`](#mietteerror).
- `instanceof` works at every layer: instances are `instanceof YourClass`,
  `instanceof MietteError`, and `instanceof Error`.

## Classes

### `MietteError`

```ts
class MietteError extends Error {
  readonly source: string
  readonly snippets: Snippet[]
  readonly severity: Severity
  readonly code?: string
  readonly help?: string
  readonly url?: string

  constructor(init: MietteErrorInit)

  format(): string
}
```

A throwable `Error` that carries source-pointing snippets and renders itself via
[`.format()`](#mietteerror-format). Pass it anywhere a plain `Error` is expected.

```ts
import { MietteError } from "miette"

throw new MietteError({
  message: "Type 'string' is not assignable to type 'number'.",
  source: "const x: number = 'oops';",
  snippets: [{ span: [18, 24], label: "string here" }],
  diagnostic: { code: "TS2322", help: "Use a number literal instead." },
})
```

**Field notes**

- `.name` is set to `init.diagnostic?.code` if provided, otherwise `"MietteError"`.
  That's what shows in stack traces and `Error: ...` headers.
- `.message` defaults to `"Diagnostic error"` if you omit it.
- `.cause` is forwarded to `Error`'s constructor — `instanceof MietteError` plays
  nicely with `Error.cause` walkers.

#### `MietteError#format()`

```ts
format(): string;
```

Returns the rendered diagnostic. Equivalent to calling [`formatDiagnostic`](#formatdiagnostic-input)
with the error's own fields. Pure — call it as many times as you like.

### `Diagnostic`

```ts
class Diagnostic {
  constructor(input: DiagnosticInput)

  readonly input: DiagnosticInput
  readonly message: string
  readonly code?: string
  readonly help?: string
  readonly url?: string
  readonly source: string // always newline-terminated
  readonly severity: Severity
  readonly snippets: Snippet[]
  readonly functionName: string
  readonly fileAndLineNumber?: string // parsed from input.error.stack
  readonly cause?: Error
}
```

A normalized view over a [`DiagnosticInput`](#diagnosticinput). Reads
`input.error.stack` once at construction time to derive `fileAndLineNumber`.

You usually don't construct this directly — [`formatDiagnostic`](#formatdiagnostic-input)
does. Use it when you want to inspect the parsed view before rendering, or when you
want a custom [`Reporter`](#reporter).

```ts
import { Diagnostic, Reporter, unicode } from "miette"

const d = new Diagnostic({
  error: new Error("oops"),
  source: "x",
  snippets: [],
})
if (d.severity === "ERROR")
  console.error(
    new Reporter(d, unicode().styles, unicode().characters).render(),
  )
```

### `Reporter`

```ts
class Reporter {
  constructor(diagnostic: Diagnostic, style: ThemeStyle, chars: ThemeCharacters)
  render(): string
}
```

Builds the final string. Pure — no I/O, no globals beyond what the [`Painter`](#painter)
closures captured. Construct one per diagnostic, call `render()`, discard.

Use it directly when you want to force a theme:

```ts
import { Diagnostic, Reporter, ascii } from "miette"

const d = new Diagnostic({
  /* ... */
})
const theme = ascii()
const out = new Reporter(d, theme.styles, theme.characters).render()
```

**Behavior worth knowing**

- The cause chain is walked up to `input.causeDepth` levels (default `8`). Set
  to `0` to suppress it entirely. Deeper chains are truncated.
- Snippets are clipped to the line containing `span[0]`. Multi-line spans only
  annotate the start line.
- The top stack frame is parsed from `error.stack` to populate
  `[file:line:col]` in the snippet header. If parsing fails, no header is shown.

## Themes

### `ascii()`

```ts
function ascii(): Theme
```

Returns a theme that uses plain ASCII box characters (`-`, `|`, `+`, ...).
Use this when targeting environments that may render Unicode box-drawing
incorrectly (older Windows shells, log aggregators, plain-text email).

### `unicode()`

```ts
function unicode(): Theme
```

Returns a theme that uses Unicode box-drawing characters (`─`, `│`, `╭`, ...).
This is the default in any modern terminal.

### `Theme`

```ts
interface Theme {
  characters: ThemeCharacters
  styles: ThemeStyle
}
```

A pair of glyphs and painters. The two are independent — you can mix `ascii()`
glyphs with the default color styles, or vice versa, by building the object yourself.

## Types

### `DiagnosticInput`

```ts
interface DiagnosticInput {
  error: Error
  source: string
  snippets: Snippet[]
  /** Overrides `error.message` when rendered. */
  message?: string
  diagnostic?: DiagnosticMeta
  /** Defaults to "ERROR". */
  severity?: Severity
  /** Max depth to walk `Error.cause`. Defaults to 8. Use 0 to suppress. */
  causeDepth?: number
}
```

Everything [`formatDiagnostic`](#formatdiagnostic-input) needs. `error` is required —
it provides `.name`, `.stack`, and `.cause`. `source` is the buffer that
[`snippets`](#snippet) point into; trailing newlines are normalized.

`causeDepth` is an implementation cap rather than a contract: the default may
change in a future version. Pin it explicitly if you depend on a specific depth.

### `Snippet`

```ts
interface Snippet {
  /** Half-open range `[start, end)` into `source`. */
  span: [start: number, end: number]
  label?: string
}
```

A pointer into the source. `span` indexes **JS string indices (UTF-16 code units)** —
the same units `String#length`, `String#indexOf`, and most JS parsers (Babel, oxc,
swc, ts-morph) report. Astral-plane characters like 🦀 count as 2. Labels render
under the highlighted region with a connector line.

Multiple snippets on the same line are colored from a six-color palette
(`Reporter` cycles modulo palette length) and their labels stack.

### `DiagnosticMeta`

```ts
interface DiagnosticMeta {
  /** Short identifier — appears in the header. */
  code?: string
  /** Footer hint, rendered with the `‽` glyph. */
  help?: string
  /** Renders next to the code as ` ( url )`. */
  url?: string
}
```

All optional. None of them are used to render the snippets — they decorate the
header and footer.

### `Severity`

```ts
type Severity = "ERROR" | "WARNING" | "ADVICE"
```

Controls the header glyph (`×`, `⚠`, `‽`) and color. Defaults to `"ERROR"`.
The cause chain always renders in the `ADVICE` color regardless of the parent
severity.

### `MietteErrorInit`

```ts
interface MietteErrorInit {
  source: string
  snippets: Snippet[]
  message?: string
  severity?: Severity
  diagnostic?: DiagnosticMeta
  cause?: Error
  /** Max depth to walk `Error.cause`. Defaults to 8. Use 0 to suppress. */
  causeDepth?: number
}
```

Constructor argument for [`MietteError`](#mietteerror). Note this is **not** the
same shape as [`DiagnosticInput`](#diagnosticinput) — there's no `error` field
because the `MietteError` _is_ the error.

### `DiagnosticDef`

```ts
interface DiagnosticDef<Args = never> {
  code?: Render<Args>
  severity?: Severity
  message: Render<Args>
  help?: Render<Args>
  url?: Render<Args>
}

type Render<Args> = [Args] extends [never]
  ? string
  : string | ((args: Args) => string)
```

The argument to [`defineDiagnostic`](#definediagnostic-def). Everything except
`message` is optional. The `Render<Args>` alias collapses to plain `string` when
the generic is omitted, so simple defs stay terse.

### `DefinedDiagnostic`

```ts
type DefinedDiagnostic<Args> = [Args] extends [never]
  ? new (init: DefinedDiagnosticInit) => MietteError
  : new (init: DefinedDiagnosticInitWithArgs<Args>) => MietteError
```

The constructor type [`defineDiagnostic`](#definediagnostic-def) returns. The
conditional ensures `args` is required exactly when at least one definition field
is function-shaped.

### `DefinedDiagnosticInit`

```ts
interface DefinedDiagnosticInit {
  source: string
  snippets: Snippet[]
  cause?: Error
  severity?: Severity
  causeDepth?: number
}

interface DefinedDiagnosticInitWithArgs<Args> extends DefinedDiagnosticInit {
  args: Args
}
```

Per-throw fields for a defined diagnostic. Note there's no `code` / `message` /
`help` / `url` here — those are pinned to the definition.

### `Line`

```ts
interface Line {
  /** 0-based line number. */
  line_number: number
  /** Byte offset of the first char of this line within the source. */
  offset: number
  /** Length of the line text, not including the terminating newline. */
  length: number
  /** Raw line text without newline. */
  text: string
}
```

Exposed for tooling that wants to compute spans the same way miette splits
internally. Not used in the typical render path.

### `ThemeStyle`

```ts
interface ThemeStyle {
  error: Painter
  warning: Painter
  advice: Painter
  code: Painter
  help: Painter
  filename: Painter
  highlights: Painter[]
}
```

The set of [`Painter`](#painter) functions a [`Reporter`](#reporter) uses. Build
your own by importing the painters file is not supported — make one inline:

```ts
import type { ThemeStyle } from "miette"

const id = (s: string) => s
const plain: ThemeStyle = {
  error: id,
  warning: id,
  advice: id,
  code: id,
  help: id,
  filename: id,
  highlights: [id],
}
```

### `ThemeCharacters`

```ts
interface ThemeCharacters {
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
```

The glyph table. Provided fully for both [`ascii()`](#ascii) and [`unicode()`](#unicode).
Override the few you care about by spreading the result:

```ts
import { unicode } from "miette"

const chars = { ...unicode().characters, fyi: "i" }
```

### `Painter`

```ts
type Painter = (s: string) => string
```

A function that wraps a string in ANSI escape codes (or, when color is disabled,
returns it unchanged). The function is closure-aware of whether color is currently
supported — it checks at call time, not at construction time.

## Environment

| Variable              | Effect                                               |
| --------------------- | ---------------------------------------------------- |
| `NO_COLOR`            | Any value disables color. Unicode glyphs still used. |
| `FORCE_COLOR=0`       | Disables color.                                      |
| `FORCE_COLOR=false`   | Disables color.                                      |
| `FORCE_COLOR=1`       | Forces color even when stdout is not a TTY.          |
| `TERM=linux`          | On non-Windows, falls back to ASCII box characters.  |
| `CI`                  | On Windows, opts into Unicode.                       |
| `WT_SESSION`          | Windows Terminal — opts into Unicode.                |
| `TERM_PROGRAM=vscode` | VS Code integrated terminal — opts into Unicode.     |

Browser environments are always treated as color- and Unicode-capable.

The detection is implemented in `src/ansi.ts` — see [`supportsUnicode`](https://github.com/gabrielcsapo/miette/blob/main/packages/miette/src/ansi.ts)
on GitHub if you want the exact heuristic.

## See also

- [Get started](/usage) for the narrative tour and integration recipes.
- [Anti-patterns](/usage#anti-patterns) for the edge cases that won't crash but
  will look wrong.
- [Testing miette output](/usage#testing-miette-output) for the `NO_COLOR`
  snapshot pattern.
