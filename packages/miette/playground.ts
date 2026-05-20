import { MietteError, formatDiagnostic } from "./src/index.js"

// Multi-snippet on one line
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
      help: "Change int or string to match",
      url: "https://github.com/foo/bar#guides",
    },
  }),
)

// Snippets across multiple lines
console.log(
  formatDiagnostic({
    error: new Error(),
    source: "source\n  text\n    here",
    message: "This is the part that broke",
    snippets: [
      { span: [0, 6], label: "this should be foo" },
      { span: [9, 13], label: "this should be goodbye" },
    ],
    diagnostic: {
      help: "Please consult the guides",
      url: "https://github.com/foo/bar#guides",
    },
  }),
)

// MietteError class with .cause chain
const root = new Error("disk full")
const inner = new Error("write failed", { cause: root })
const err = new MietteError({
  source: "const x: number = 'oops';",
  snippets: [{ span: [18, 24], label: "string assigned to number" }],
  diagnostic: { code: "TS2322", help: "Use a number literal instead." },
  message: "Type 'string' is not assignable to type 'number'.",
  cause: inner,
})
console.log(err.format())
