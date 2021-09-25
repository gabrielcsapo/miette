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

    expect(renderer.debugString).toMatchSnapshot();
  });
});
