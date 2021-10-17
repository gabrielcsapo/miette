process.env.FORCE_COLOR = "0";

import { Diagnostic } from "./diagnostic";
import { Reporter } from "./reporter";
import { Theme } from "./theme";

describe("reporter", () => {
  test("should be able to render ascii output (multi-line)", () => {
    const diagnostic = new Diagnostic({
      error: new Error("Types mismatched for operation."),
      source: '3 + "5"',
      snippets: [
        {
          context: "3",
          highlight: "int",
        },
        {
          context: "+",
          highlight: "Doesn't support these values",
        },
        {
          context: '"5"',
          highlight: "string",
        },
      ],
      diagnostic: {
        help: "Change int or string to be the right type and try again",
        url: "http://github.com/foo/bar#guides",
      },
    });
    const renderer = new Reporter(
      diagnostic,
      Theme.ascii().styles,
      Theme.ascii().characters
    );
    renderer.render();

    expect(renderer.debugString).toMatchSnapshot();
  });

  test("should be able to render unicode output (multi-line)", () => {
    const diagnostic = new Diagnostic({
      error: new Error("Types mismatched for operation."),
      source: '3 + "5"',
      snippets: [
        {
          context: "3",
          highlight: "int",
        },
        {
          context: "+",
          highlight: "Doesn't support these values",
        },
        {
          context: '"5"',
          highlight: "string",
        },
      ],
      diagnostic: {
        help: "Change int or string to be the right type and try again",
        url: "http://github.com/foo/bar#guides",
      },
    });
    const renderer = new Reporter(
      diagnostic,
      Theme.unicode().styles,
      Theme.unicode().characters
    );
    renderer.render();

    expect(renderer.debugString).toMatchSnapshot();
  });

  test("should be able to render ascii output (single line)", () => {
    const diagnostic = new Diagnostic({
      error: new Error(),
      source: "source\n  text\n    here",
      message: "This is the part that broke",
      snippets: [
        {
          context: "source",
          highlight: "This should be foo\n",
        },
        {
          context: "text",
          highlight: "This should be goodbye\n",
        },
      ],
      diagnostic: {
        help: "Please consult the guides",
        url: "http://github.com/foo/bar#guides",
      },
    });
    const renderer = new Reporter(
      diagnostic,
      Theme.ascii().styles,
      Theme.ascii().characters
    );
    renderer.render();

    expect(renderer.debugString).toMatchSnapshot();
  });

  test("should be able to render unicode output (single line)", () => {
    const diagnostic = new Diagnostic({
      error: new Error(),
      source: "source\n  text\n    here",
      message: "This is the part that broke",
      snippets: [
        {
          context: "source",
          highlight: "This should be foo\n",
        },
        {
          context: "text",
          highlight: "This should be goodbye\n",
        },
      ],
      diagnostic: {
        help: "Please consult the guides",
        url: "http://github.com/foo/bar#guides",
      },
    });
    const renderer = new Reporter(
      diagnostic,
      Theme.unicode().styles,
      Theme.unicode().characters
    );
    renderer.render();

    expect(renderer.debugString).toMatchSnapshot();
  });
});
