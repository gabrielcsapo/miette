process.env.FORCE_COLOR = "0"

import { describe, expect, test } from "vitest"
import { MietteError, formatDiagnostic } from "../miette.js"

describe("formatDiagnostic", () => {
  test("renders a basic diagnostic", () => {
    const out = formatDiagnostic({
      error: new Error("oops"),
      source: "let x = 1;",
      snippets: [{ span: [4, 5], label: "here" }],
      diagnostic: { help: "Try y instead" },
    })
    expect(out).toContain("oops")
    expect(out).toContain("here")
    expect(out).toContain("Try y instead")
  })

  test("walks the .cause chain", () => {
    const root = new Error("disk full")
    const inner = new Error("write failed", { cause: root })
    const outer = new Error("save failed", { cause: inner })
    const out = formatDiagnostic({
      error: outer,
      source: "save();",
      snippets: [{ span: [0, 4], label: "this call" }],
    })
    expect(out).toContain("save failed")
    expect(out).toContain("caused by: write failed")
    expect(out).toContain("caused by: disk full")
  })

  test("respects causeDepth override", () => {
    const a = new Error("a")
    const b = new Error("b", { cause: a })
    const c = new Error("c", { cause: b })

    const unlimitedish = formatDiagnostic({
      error: c,
      source: "x",
      snippets: [{ span: [0, 1] }],
    })
    expect(unlimitedish).toContain("caused by: b")
    expect(unlimitedish).toContain("caused by: a")

    const shallow = formatDiagnostic({
      error: c,
      source: "x",
      snippets: [{ span: [0, 1] }],
      causeDepth: 1,
    })
    expect(shallow).toContain("caused by: b")
    expect(shallow).not.toContain("caused by: a")

    const none = formatDiagnostic({
      error: c,
      source: "x",
      snippets: [{ span: [0, 1] }],
      causeDepth: 0,
    })
    expect(none).not.toContain("caused by:")
  })

  test("respects message override", () => {
    const out = formatDiagnostic({
      error: new Error("original"),
      source: "x",
      message: "overridden",
      snippets: [{ span: [0, 1] }],
    })
    expect(out).toContain("overridden")
    expect(out).not.toContain("original")
  })
})

describe("MietteError", () => {
  test("is an Error subclass", () => {
    const err = new MietteError({ source: "x", snippets: [], message: "boom" })
    expect(err).toBeInstanceOf(Error)
    expect(err).toBeInstanceOf(MietteError)
    expect(err.message).toBe("boom")
  })

  test("renders via .format()", () => {
    const err = new MietteError({
      source: "const x: number = 'oops';",
      snippets: [{ span: [18, 24], label: "string here" }],
      diagnostic: { code: "TS2322", help: "Use a number." },
      message: "Type 'string' is not assignable to type 'number'.",
    })
    expect(err.name).toBe("TS2322")
    expect(err.help).toBe("Use a number.")
    const out = err.format()
    expect(out).toContain("Type 'string' is not assignable to type 'number'.")
    expect(out).toContain("Use a number.")
    expect(out).toContain("string here")
  })

  test("carries .cause through to the formatter", () => {
    const cause = new Error("upstream")
    const err = new MietteError({
      source: "y",
      snippets: [{ span: [0, 1], label: "x" }],
      message: "downstream",
      cause,
    })
    expect(err.cause).toBe(cause)
    expect(err.format()).toContain("caused by: upstream")
  })
})
