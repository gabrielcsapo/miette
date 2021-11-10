import { Diagnostic } from "./src/diagnostic";
import { Reporter } from "./src/reporter";
import { Theme } from "./src/theme";

const diagnostic2 = new Diagnostic({
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
const renderer2 = new Reporter(
  diagnostic2,
  Theme.ascii().styles,
  Theme.ascii().characters
);
renderer2.render();

const diagnostic3 = new Diagnostic({
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
const renderer3 = new Reporter(
  diagnostic3,
  Theme.ascii().styles,
  Theme.ascii().characters
);
renderer3.render();

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

const diagnostic1 = new Diagnostic({
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
const renderer1 = new Reporter(
  diagnostic1,
  Theme.unicode().styles,
  Theme.unicode().characters
);
renderer1.render();
