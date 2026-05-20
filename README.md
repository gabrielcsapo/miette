# miette

> Fancy upgrade to `console.log` — annotated, source-aware error diagnostics for TypeScript.

`miette` turns plain error messages into Rust-flavored diagnostics that point at the
exact spans of code that went wrong, with labels, help text, and a `.cause` chain.
Zero runtime dependencies. Runs in Node and the browser.

Inspired by [`zkat/miette`](https://github.com/zkat/miette).

## Install

```sh
pnpm add miette
```

## Quick start

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
    diagnostic: {
      code: "E0277",
      help: "Coerce one side to match the other.",
    },
  })
);
```

Throwable variant:

```ts
import { MietteError } from "miette";

throw new MietteError({
  message: "Type 'string' is not assignable to type 'number'.",
  source: "const x: number = 'oops';",
  snippets: [{ span: [18, 24], label: "string here" }],
  diagnostic: { code: "TS2322", help: "Use a number literal instead." },
});
```

`MietteError` is a real `Error` subclass with a `.format()` method. ES2022 `Error.cause`
chains are walked and rendered automatically.

## Interactive playground

[gabrielcsapo.github.io/miette](https://gabrielcsapo.github.io/miette) — edit source, drag
to add snippets, see the rendered output live in an `xterm.js` terminal.

## Development

This is a pnpm workspace with two packages:

- `packages/miette` — the library
- `packages/website` — Vitepress site with the interactive playground

```sh
pnpm install
pnpm -r run build
pnpm -r run test
pnpm playground       # node CLI demo
pnpm dev:site         # Vitepress dev server at http://localhost:5173
```

## License

Apache-2.0
