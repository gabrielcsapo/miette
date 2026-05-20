---
title: Get started
outline: deep
---

# Get started

You've seen the playground. Now wire it into your code.

## Install

```sh
pnpm add miette
# or: npm install miette
# or: yarn add miette
```

Zero runtime dependencies, dual ESM + CJS, ships its own types, Node 20+.
Works in the browser without a bundler shim — see [In the browser](#in-the-browser).

## A diagnostic in 10 lines

```ts
import { formatDiagnostic } from "miette";

console.log(
  formatDiagnostic({
    error: new Error("Types mismatched for operation."),
    source: '3 + "5"',
    snippets: [
      { span: [0, 1], label: "int" },
      { span: [2, 3], label: "doesn't support these values" },
      { span: [4, 7], label: "string" },
    ],
    diagnostic: { help: "Coerce one side to match the other." },
  })
);
```

Prints:

```
Error: Error

   × Types mismatched for operation.

   ╭───[example.ts:4:3]
 0 │ 3 + "5"
   · ┬ ┬ ─┬─
   · │ │  ╰── string
   · │ ╰── doesn't support these values
   · ╰── int
   ╰───

‽ Coerce one side to match the other.
```

Three ingredients, every time: an `Error` for identity, a `source` string to annotate,
and an array of [`Snippet`](/api#snippet)s that point into it. `formatDiagnostic` returns
a string — `console.log` it, write it to a file, render it as HTML. miette does no I/O.

## How spans work

Spans are **half-open `[start, end)` ranges into `source`**, indexed in JS string
units (UTF-16 code units — the same units `String#length` and `String#indexOf`
return, and what every major JS parser already gives you). `source` is treated
as a single buffer; newlines are part of it. Pick offsets from your parser, your
tokenizer, or a manual `source.indexOf(...)`.

```ts
const source = 'const x = "oops";';
//              0         1
//              0123456789012345678
// The string literal is at [10, 16): "oops"
```

::: tip Computing spans from line/column
Most parsers give you `{ line, column }`. Convert once to a string-index offset by
walking `source.split("\n")` and summing lengths plus one for the newline. Astral
characters like 🦀 take two slots — that matches both `String#length` and what
your parser is already counting, so it Just Works.
:::

A snippet is dropped silently if its `[start, end)` falls outside the source or
collapses to zero columns after clipping. Multiple snippets on the same line get
distinct colors and stacked under-labels. See [Anti-patterns](#anti-patterns) for the
edge cases worth knowing.

## Throw it: `MietteError`

`formatDiagnostic` is great for "render and log." When you want an exception that
*also* renders well, throw a [`MietteError`](/api#mietteerror):

```ts
import { MietteError } from "miette";

throw new MietteError({
  message: "Type 'string' is not assignable to type 'number'.",
  source: "const x: number = 'oops';",
  snippets: [{ span: [18, 24], label: "string here" }],
  diagnostic: { code: "TS2322", help: "Use a number literal instead." },
});
```

It's a real `Error` — `instanceof Error` is true, `.message`, `.stack`, and `.cause`
all work. The extra trick is `.format()`:

```ts
try {
  compile();
} catch (e) {
  if (e instanceof MietteError) {
    process.stderr.write(`${e.format()}\n`);
    process.exit(1);
  }
  throw e;
}
```

### When to throw vs. when to format

| Situation                                            | Use                          |
| ---------------------------------------------------- | ---------------------------- |
| Linter or batch tool reporting many issues           | `formatDiagnostic` + collect |
| A single fatal failure that should unwind the stack  | `throw new MietteError(...)` |
| Wrapping a third-party error you caught              | `formatDiagnostic` with `error.cause` |
| Vitest / Jest custom matcher                         | `formatDiagnostic` in the failure message |

## Reusable diagnostics: `defineDiagnostic`

When you throw the same shape of error from many call sites, lift the *definition*
out of the throw and reuse it. [`defineDiagnostic`](/api#definediagnostic-def) is
the runtime parallel of Rust miette's `#[derive(Diagnostic)]` — code, message,
help, and url are pinned to the def; per-throw input carries source, snippets, and
any interpolation `args`.

```ts
import { defineDiagnostic } from "miette";

const TypeMismatch = defineDiagnostic<{ actual: string; expected: string }>({
  code: "TS2345",
  message: ({ actual, expected }) =>
    `Argument of type '${actual}' is not assignable to '${expected}'.`,
  help: ({ expected }) => `Pass a ${expected}, or change the parameter type.`,
});

// Anywhere in the codebase — same shape, varying details.
throw new TypeMismatch({
  source,
  snippets: [{ span: [85, 90], label: "string passed here" }],
  args: { actual: "string", expected: "number" },
});
```

`TypeMismatch` is a real class extending [`MietteError`](#throw-it-mietteerror) —
`instanceof TypeMismatch`, `instanceof MietteError`, and `instanceof Error` all
match. `.name` reflects the `code`, so stack traces read `TS2345: ...` instead of
`MietteError: ...`.

### When you don't need args

Drop the generic and pass plain strings:

```ts
const ConfigMissing = defineDiagnostic({
  code: "CONFIG_MISSING",
  severity: "ERROR",
  message: "No config file found.",
  help: "Add a miette.config.ts at the repo root.",
});

throw new ConfigMissing({ source: "(repo root)", snippets: [] });
```

Without the generic, TypeScript drops the `args` field from the constructor — you
don't pay for what you don't use.

### Mixing function and string fields

Anything optional that's the same across every throw stays a plain string; the
function form is only needed when the value depends on `args`:

```ts
const ParseError = defineDiagnostic<{ token: string }>({
  code: "PARSE_ERROR",
  url: "https://example.com/errors/parse",   // static
  message: ({ token }) => `Unexpected token: ${token}`,
  help: "Check the line for a stray character.",  // static
});
```

### Per-throw overrides

`severity`, `cause`, and `causeDepth` are accepted at construction time and
override the def's defaults — useful when one call site is more severe than the
rest or wraps an upstream error:

```ts
const upstream = new Error("disk full");

throw new TypeMismatch({
  source, snippets, args: { actual: "string", expected: "number" },
  severity: "WARNING",
  cause: upstream,
});
```

## Cause chains

ES2022 `Error.cause` is walked automatically — up to `causeDepth` levels (default
`8`) — and rendered beneath the diagnostic:

```ts
const disk = new Error("disk full");
const write = new Error("write failed", { cause: disk });

console.log(
  formatDiagnostic({
    error: new Error("save() rejected", { cause: write }),
    source: "await db.save(user);",
    snippets: [{ span: [6, 13], label: "this call" }],
  })
);
```

```
   ▶ caused by: write failed
     ▶ caused by: disk full
```

### Tuning the depth

Pass `causeDepth` to override:

```ts
formatDiagnostic({
  error: outer,
  source,
  snippets,
  causeDepth: 2,   // walk at most 2 levels
});

formatDiagnostic({
  error: outer,
  source,
  snippets,
  causeDepth: 0,   // suppress the chain entirely
});
```

`MietteError` accepts the same option, plus `cause` directly — it forwards both
to the standard `Error` constructor and the renderer:

```ts
try {
  await fs.writeFile(path, data);
} catch (cause) {
  throw new MietteError({
    message: `Could not write ${path}.`,
    source: "await fs.writeFile(path, data);",
    snippets: [{ span: [15, 24], label: "failed here" }],
    cause: cause as Error,
  });
}
```

## Severity

Three levels: `"ERROR"` (default), `"WARNING"`, `"ADVICE"`. They change the header
color and gutter glyph but not the layout.

```ts
formatDiagnostic({
  error: new Error("Unused import"),
  source: "import { foo } from './bar';",
  snippets: [{ span: [9, 12], label: "imported but unused" }],
  severity: "WARNING",
  diagnostic: { help: "Remove the import." },
});
```

For a `MietteError`:

```ts
new MietteError({ /* ... */ severity: "ADVICE" });
```

## Recipes

Three integrations chosen because miette earns its keep there: validation libraries,
AST tooling, and config loaders. The pattern is the same — get a span, build the
diagnostic.

### Zod validation errors

Zod gives you a `ZodIssue[]` with a path. Convert path to a span by walking the source.

```ts
import { z, type ZodError } from "zod";
import { formatDiagnostic, type Snippet } from "miette";

function spanForJsonPath(source: string, path: (string | number)[]): [number, number] {
  // Trivial implementation: find the last key in the path as a JSON key.
  // In real code use a JSON CST like `jsonc-parser`.
  const key = String(path[path.length - 1]);
  const needle = JSON.stringify(key);
  const at = source.indexOf(needle);
  return at < 0 ? [0, source.length] : [at, at + needle.length];
}

export function reportZod(source: string, err: ZodError): string {
  const snippets: Snippet[] = err.issues.map((issue) => ({
    span: spanForJsonPath(source, issue.path),
    label: issue.message,
  }));
  return formatDiagnostic({
    error: new Error("Invalid configuration"),
    source,
    snippets,
    diagnostic: { code: "CONFIG_INVALID", help: "Fix the highlighted fields." },
  });
}
```

::: info Why not just print `err.message`?
Zod's default formatting tells you *what* is wrong. miette tells you *where* — point
the user at the exact characters in their config file. That's the whole pitch.
:::

### AST parser errors (Babel, oxc, ts-morph, swc)

Most JS parsers give you `start`/`end` offsets directly on the node — Babel, oxc,
swc, and ts-morph all use the same UTF-16 indexing miette wants. Pass them
straight through:

```ts
import { parse } from "@babel/parser";
import { MietteError } from "miette";

export function compile(source: string, filename: string): void {
  let ast;
  try {
    ast = parse(source, { sourceType: "module", sourceFilename: filename });
  } catch (cause) {
    // Babel errors carry .pos
    const pos = (cause as { pos?: number }).pos ?? 0;
    throw new MietteError({
      message: (cause as Error).message,
      source,
      snippets: [{ span: [pos, pos + 1], label: "unexpected token" }],
      diagnostic: { code: "PARSE_ERROR" },
      cause: cause as Error,
    });
  }

  // ... lint the AST, throwing MietteErrors with node.start / node.end spans.
}
```

### A `--check` CLI

A common shape: read a file, validate it, exit nonzero on failure.

```ts
import { readFile } from "node:fs/promises";
import { MietteError } from "miette";

const source = await readFile(process.argv[2], "utf8");

try {
  validate(source);
} catch (e) {
  if (e instanceof MietteError) {
    process.stderr.write(`${e.format()}\n`);
    process.exit(1);
  }
  throw e;
}
```

`NO_COLOR` is honored automatically when piped to a file or another process, so the
above is safe in CI logs.

## Attaching diagnostics to existing errors

You don't have to inherit from `MietteError`. If you have a `ParseError` class
already, store the diagnostic data on it and format on demand:

```ts
import { formatDiagnostic, type Snippet } from "miette";

export class ParseError extends Error {
  override name = "ParseError";
  constructor(
    message: string,
    readonly source: string,
    readonly snippets: Snippet[],
    readonly help?: string
  ) {
    super(message);
  }
  format(): string {
    return formatDiagnostic({
      error: this,
      source: this.source,
      snippets: this.snippets,
      diagnostic: { help: this.help },
    });
  }
}
```

The renderer cares only about the shape you pass into `formatDiagnostic` — not where
the data came from.

## In the browser

`formatDiagnostic` returns a string. It doesn't read `process`, it doesn't poke at
streams. In the browser it always emits ANSI escapes (the playground on the home page
runs this exact code). You then have two choices:

**xterm.js**, if you want a real terminal feel:

```ts
import { Terminal } from "@xterm/xterm";
import { formatDiagnostic } from "miette";

const term = new Terminal({ convertEol: true });
term.open(document.getElementById("term")!);
term.write(formatDiagnostic({ /* ... */ }));
```

**ansi-to-html**, if you want regular DOM:

```ts
import AnsiToHtml from "ansi-to-html";
import { formatDiagnostic } from "miette";

const converter = new AnsiToHtml({ newline: true });
const html = converter.toHtml(formatDiagnostic({ /* ... */ }));
document.querySelector("pre")!.innerHTML = html;
```

If you want plain text, force the ASCII theme so the box-drawing characters don't get
mangled by a font that lacks them — see [Themes](#themes).

## Themes

miette auto-detects whether the environment supports Unicode and truecolor. To force
one, build a `Reporter` yourself:

```ts
import { Reporter, Diagnostic, ascii } from "miette";

const theme = ascii(); // or: unicode()
const d = new Diagnostic({ /* DiagnosticInput */ });
const output = new Reporter(d, theme.styles, theme.characters).render();
```

Detection rules, in order:

- Browser → color + Unicode on.
- `NO_COLOR=1` → no color (Unicode still on).
- `FORCE_COLOR=0` or `FORCE_COLOR=false` → no color.
- `FORCE_COLOR=1` → color even when not a TTY.
- Otherwise: color iff `process.stdout.isTTY`.
- `TERM=linux` on non-Windows → ASCII characters.

## Testing miette output

Snapshot the plain string by disabling color. The cleanest way is the env var:

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    env: { NO_COLOR: "1" },
  },
});
```

Then:

```ts
import { expect, test } from "vitest";
import { formatDiagnostic } from "miette";

test("reports a parse error", () => {
  const out = formatDiagnostic({
    error: new Error("oops"),
    source: "let x =",
    snippets: [{ span: [6, 7], label: "expected expression" }],
  });
  expect(out).toMatchInlineSnapshot();
});
```

For tests that *do* assert on color, pin the theme explicitly via `Reporter` rather
than relying on terminal detection.

## Anti-patterns

A short list of "won't crash but you'll be sad":

- **Overlapping spans on the same line.** They render — colors stack — but the
  under-labels are drawn in the order snippets are appended, so the visual ordering
  can surprise you. Order your snippets left-to-right or be intentional about it.
- **Spans past the end of the source.** Silently clipped. If your snippet doesn't
  appear, log `source.length` and confirm your offsets are in the same units —
  miette indexes UTF-16 code units (what `String#length` returns), not Unicode
  codepoints.
- **Spans that span multiple lines.** Only the line containing `start` is annotated.
  Split the range into per-line snippets.
- **Setting `severity` on the rendered diagnostic and a deeper `cause`.** Severity
  applies to the top-level diagnostic only — `cause` chains always render as advice.
- **Mutating `MietteError` fields after construction.** They're declared `readonly`;
  TypeScript will catch most cases, but at runtime nothing stops you. Don't.
- **Passing a non-`Error` as `cause`.** The walker only follows `instanceof Error`.
  Strings and plain objects are ignored.

## Next steps

- [API reference](/api) — every export, every type.
- [Playground](/) — paste your own source and snippets.
- [GitHub](https://github.com/gabrielcsapo/miette) — issues and source.
