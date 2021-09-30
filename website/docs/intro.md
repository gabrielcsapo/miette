---
sidebar_position: 1
---

# Getting started

Let's discover **Miette in less than 5 minutes**.

## Getting Started

Get started by **installing Miette**.

```shell
npm install miette --save
```

## Instrument your functions

Using miette you can make custom error objects that allow you to

```js
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
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.stack);
        expect(error.stack).toMatchSnapshot();
      }
    }
  }
}

FooBarBaz();
```

The final output will look like the following!

```shell
Error: foo::bar::baz

   × Should make things dynamic

    ╭───[miette.test.ts:25:15]
 0  │ function FooBarBaz() {
 1  │   // eslint-disable-next-line no-constant-condition
 2  │   if (true) {
    ·     ────┬────
    ·         ╰── This will always be called
 3  │     try {
 4  │       throw new ShouldBeFalseError(\"Should make things dynamic\");
 5  │     } catch (error) {
 6  │       if (error instanceof Error) {
 7  │         console.log(error.stack);
 8  │         expect(error.stack).toMatchSnapshot();
 9  │       }
 10 │     }
 11 │   }
 12 │ }
 13 │
    ╰───
‽ Please consult the guides at http://github.com/foo/bar#guides
```

## Contribute back!

Help improve Miette by [opening up issues](https://github.com/gabrielcsapo/miette/issues) with your use cases of Miette and reproductions of errors that don't look as expected!
