---
title: Declarative diagnostics
outline: deep
aside: false
---

# Declarative diagnostics

`defineDiagnostic` pins the shape of a diagnostic — code, message, help, url —
once, so each throw site only carries the parts that actually vary (source,
snippets, args). The runtime parallel of Rust miette's `#[derive(Diagnostic)]`.

Edit the definition, args, source, or snippets below and watch the rendered
output update live. The right pane shows the equivalent TypeScript so you can
paste it straight into your codebase.

<DefinePlayground />

::: tip Use `{placeholder}` in templates
The templates here use `{name}` placeholders for the playground. In real code
you'd write a normal arrow function:

```ts
message: ({ actual, expected }) =>
  `Argument of type '${actual}' is not assignable to '${expected}'.`,
```

Same result, full TypeScript type-checking on the `args` shape.
:::

For the API contract, see [`defineDiagnostic`](/api#definediagnostic-def). For
how it fits into the rest of the library, see
[Reusable diagnostics](/usage#reusable-diagnostics-definediagnostic).
