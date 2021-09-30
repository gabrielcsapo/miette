import prettier from "prettier";

import { miette } from "./miette";

describe("miette", () => {
  test("should be able to render with decorators", () => {
    @miette(
      "foo::bar::baz",
      prettier.format(FooBarBaz.toString(), { parser: "babel" })
    )
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
        } catch (error) {
          if (error instanceof Error) {
            console.log(error.stack);
            expect(error.stack).toMatchSnapshot();
          }
        }
      }
    }

    FooBarBaz();
  });
});
