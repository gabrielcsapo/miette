process.env.FORCE_COLOR = "0"

import { describe, expect, test } from "vitest"
import { defineDiagnostic } from "../define.js"
import { MietteError } from "../miette.js"

describe("defineDiagnostic", () => {
  test("creates an Error subclass with static metadata", () => {
    const Simple = defineDiagnostic({
      code: "SIMPLE",
      message: "something happened",
      help: "do the other thing",
    })

    const err = new Simple({ source: "x", snippets: [] })
    expect(err).toBeInstanceOf(Error)
    expect(err).toBeInstanceOf(MietteError)
    expect(err).toBeInstanceOf(Simple)
    expect(err.message).toBe("something happened")
    expect(err.code).toBe("SIMPLE")
    expect(err.help).toBe("do the other thing")
  })

  test("interpolates args through message and help", () => {
    const TS2345 = defineDiagnostic<{ actual: string; expected: string }>({
      code: "TS2345",
      message: ({ actual, expected }) =>
        `Argument of type '${actual}' is not assignable to '${expected}'.`,
      help: ({ expected }) => `Pass a ${expected} instead.`,
    })

    const err = new TS2345({
      source: 'divide(10, "two")',
      snippets: [{ span: [11, 16], label: "string passed here" }],
      args: { actual: "string", expected: "number" },
    })

    expect(err.message).toBe(
      "Argument of type 'string' is not assignable to 'number'.",
    )
    expect(err.help).toBe("Pass a number instead.")
    expect(err.format()).toContain("string passed here")
  })

  test("uses the code as the runtime class name", () => {
    const X = defineDiagnostic({ code: "X1234", message: "hi" })
    expect(X.name).toBe("X1234")
    expect(new X({ source: "x", snippets: [] }).name).toBe("X1234")
  })

  test("threads cause through MietteError", () => {
    const Wrap = defineDiagnostic({ code: "WRAP", message: "outer" })
    const cause = new Error("inner")
    const err = new Wrap({ source: "x", snippets: [], cause })
    expect(err.cause).toBe(cause)
    expect(err.format()).toContain("caused by: inner")
  })

  test("falls back to def severity when init omits it", () => {
    const Warn = defineDiagnostic({
      code: "WARN",
      severity: "WARNING",
      message: "be careful",
    })
    const err = new Warn({ source: "x", snippets: [] })
    expect(err.severity).toBe("WARNING")
  })

  test("init severity overrides def severity", () => {
    const Warn = defineDiagnostic({
      code: "WARN",
      severity: "WARNING",
      message: "be careful",
    })
    const err = new Warn({ source: "x", snippets: [], severity: "ADVICE" })
    expect(err.severity).toBe("ADVICE")
  })
})
