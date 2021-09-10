import { MietteError } from "./miette";

function log(target:any, name:any, descriptor:any) {
  const original = descriptor.value;
  if (typeof original === 'function') {
    descriptor.value = function(...args: any) {
      console.log(`Arguments: ${args}`);
      try {
        const result = original.apply(this, args);
        console.log(`Result: ${result}`);
        return result;
      } catch (e) {
        console.log(`Error: ${e}`);
        throw e;
      }
    }
  }
  return descriptor;
}

@log
function FooBar() {
  MietteError({
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
    help: "Please consult the guides at http://github.com/foo/bar#guides",
  });
}

FooBar();
