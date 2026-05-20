process.env.FORCE_COLOR = "0"

import { describe, expect, test } from "vitest"
import { Diagnostic } from "../diagnostic.js"
import { Reporter } from "../reporter.js"
import { ascii, unicode } from "../theme.js"

describe("Reporter", () => {
  test("renders ASCII output (multi-snippet on one line)", () => {
    const d = new Diagnostic({
      error: new Error("Types mismatched for operation."),
      source: '3 + "5"',
      snippets: [
        { span: [0, 1], label: "int" },
        { span: [2, 3], label: "doesn't support these values" },
        { span: [4, 7], label: "string" },
      ],
      diagnostic: {
        help: "Change int or string to be the right type and try again",
        url: "http://github.com/foo/bar#guides",
      },
    })
    const r = new Reporter(d, ascii().styles, ascii().characters)
    expect(r.render()).toMatchSnapshot()
  })

  test("renders Unicode output (multi-snippet on one line)", () => {
    const d = new Diagnostic({
      error: new Error("Types mismatched for operation."),
      source: '3 + "5"',
      snippets: [
        { span: [0, 1], label: "int" },
        { span: [2, 3], label: "doesn't support these values" },
        { span: [4, 7], label: "string" },
      ],
      diagnostic: {
        help: "Change int or string to be the right type and try again",
        url: "http://github.com/foo/bar#guides",
      },
    })
    const r = new Reporter(d, unicode().styles, unicode().characters)
    expect(r.render()).toMatchSnapshot()
  })

  test("renders ASCII output (snippets across lines)", () => {
    const d = new Diagnostic({
      error: new Error(),
      source: "source\n  text\n    here",
      message: "This is the part that broke",
      snippets: [
        { span: [0, 6], label: "this should be foo" },
        { span: [9, 13], label: "this should be goodbye" },
      ],
      diagnostic: {
        help: "Please consult the guides",
        url: "http://github.com/foo/bar#guides",
      },
    })
    const r = new Reporter(d, ascii().styles, ascii().characters)
    expect(r.render()).toMatchSnapshot()
  })

  test("renders Unicode output (snippets across lines)", () => {
    const d = new Diagnostic({
      error: new Error(),
      source: "source\n  text\n    here",
      message: "This is the part that broke",
      snippets: [
        { span: [0, 6], label: "this should be foo" },
        { span: [9, 13], label: "this should be goodbye" },
      ],
      diagnostic: {
        help: "Please consult the guides",
        url: "http://github.com/foo/bar#guides",
      },
    })
    const r = new Reporter(d, unicode().styles, unicode().characters)
    expect(r.render()).toMatchSnapshot()
  })

  test("renders without snippets", () => {
    const d = new Diagnostic({
      error: new Error("nope"),
      source: "",
      snippets: [],
      diagnostic: { help: "try again" },
    })
    const r = new Reporter(d, unicode().styles, unicode().characters)
    expect(r.render()).toMatchSnapshot()
  })
})
