import { MietteError } from "./miette";

function FooBar() {
  MietteError({
    error: new Error(),
    source: "source\n  text\n    here\n",
    message: "This is the part that broke",
    snippets: [
      {
        context: "source",
        highlight: "This should be goodbye\n",
      },
      {
        context: "text",
        highlight: "This should be goodbye\n",
      },
    ],
    help: "Please consult the guides at http://github.com/foo/bar#guides",
  });
}

FooBar();
