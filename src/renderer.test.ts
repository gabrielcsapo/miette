import { Diagnostic } from "./diagnostic";
import { GraphicalReportHandler } from "./renderer";

describe("renderer", () => {
  test("should be able to render with all required fields", () => {
    const diagnostic = new Diagnostic({
      error: new Error(),
      source: "source\n  text\n    here\n",
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
        help: "Please consult the guides at http://github.com/foo/bar#guides",
      },
    });
    const renderer = new GraphicalReportHandler(diagnostic);
    renderer.render();

    expect(renderer.debugString).toMatchInlineSnapshot(`
      "Error: ──── [[38;2;170;117;159mError[39m] ────────────────────
      [38;2;172;65;66m╰─▶ This is the part that broke[39m

         ╭───[renderer.test.ts:7:14]
       0 │ source
         ·[38;2;172;65;66m ────┬─[39m
         ·[38;2;172;65;66m     ╰──[39m[38;2;172;65;66mThis should be foo[39m
      [38;2;172;65;66m[39m
      [38;2;172;65;66m[39m 1 │   text
         ·[38;2;172;65;66m   ──┬─[39m
         ·[38;2;172;65;66m     ╰──[39m[38;2;172;65;66mThis should be goodbye[39m
      [38;2;172;65;66m[39m
      [38;2;172;65;66m[39m 2 │     here

      ‽ [38;2;106;159;181mPlease consult the guides at http://github.com/foo/bar#guides[39m
      "
    `);
  });
});
