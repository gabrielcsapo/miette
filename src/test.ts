import { miette } from "./miette";
@miette("foo::bar::baz", FooBarBaz.toString())
class ShouldBeFalseError extends Error {
  diagnostic = {
    help: "Please consult the guides at http://github.com/foo/bar#guides",
  };

  snippets = [
    {
      context: "if (true)",
      highlight: "This will always be called",
    },
  ];
}

function FooBarBaz() {
  // eslint-disable-next-line no-constant-condition
  if (true) {
    try {
      throw new ShouldBeFalseError("Should make things dynamic");
    } catch (e) {
      console.log(e.stack);
    }
  }
}

FooBarBaz();
