export interface PlaygroundSnippet {
  start: number
  end: number
  label: string
}

export interface PlaygroundPreset {
  id: string
  label: string
  description: string
  source: string
  snippets: PlaygroundSnippet[]
  message: string
  code: string
  help: string
}

export const presets: PlaygroundPreset[] = [
  {
    id: "ts-type-error",
    label: "TypeScript · type mismatch",
    description: "A function called with the wrong argument type.",
    source: `function divide(a: number, b: number) {
  return a / b;
}

const result = divide(10, "two");
`,
    snippets: [
      { start: 85, end: 90, label: "string passed here" },
      { start: 15, end: 37, label: "signature expects (number, number)" },
    ],
    message:
      "Argument of type 'string' is not assignable to parameter of type 'number'.",
    code: "TS2345",
    help: "Pass a number literal, or parse the input first with Number(value).",
  },
  {
    id: "type-mismatch",
    label: "Operator · type mismatch",
    description: "Multi-snippet on one line — the classic miette demo.",
    source: `3 + "5"`,
    snippets: [
      { start: 0, end: 1, label: "int" },
      { start: 2, end: 3, label: "doesn't support these values" },
      { start: 4, end: 7, label: "string" },
    ],
    message: "Types mismatched for operation.",
    code: "E0277",
    help: 'Coerce one side to match. Try Number("5") or String(3).',
  },
  {
    id: "rust-borrow",
    label: "Rust · borrow checker",
    description: "Homage to the original miette crate — borrow conflict.",
    source: `let mut s = String::from("hello");
let r1 = &s;
let r2 = &mut s;
println!("{} {}", r1, r2);
`,
    snippets: [
      { start: 44, end: 46, label: "immutable borrow occurs here" },
      { start: 57, end: 63, label: "mutable borrow occurs here" },
      { start: 83, end: 85, label: "immutable borrow later used here" },
    ],
    message:
      "cannot borrow `s` as mutable because it is also borrowed as immutable",
    code: "E0502",
    help: "Move the immutable borrow out of scope before the mutable borrow, or use Cell/RefCell for interior mutability.",
  },
  {
    id: "json-trailing-comma",
    label: "JSON · trailing comma",
    description: "Strict JSON doesn't allow trailing commas.",
    source: `{
  "name": "miette",
  "version": "1.0.0",
  "keywords": ["error", "diagnostic", "ansi",]
}
`,
    snippets: [{ start: 88, end: 89, label: "remove this comma" }],
    message: 'Unexpected token \']\', "...,\\"ansi\\",]" is not valid JSON',
    code: "JSON_PARSE",
    help: "JSON spec doesn't permit trailing commas. Use JSON5 if you want them.",
  },
  {
    id: "custom",
    label: "Custom — start from scratch",
    description:
      "Blank canvas. Drag-select to add more snippets, edit anything.",
    source: `const value = "your input";
const result = process(value);
`,
    snippets: [{ start: 14, end: 26, label: "edit this label" }],
    message: "Something went wrong here.",
    code: "E0001",
    help: "Drag-select text in the source and click + snippet to point at it.",
  },
]
