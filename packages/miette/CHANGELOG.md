# 0.1.1

- removes unnecessary dependencies and adds API docs.

# 0.1.0

- @gabrielcsapo: improves rendering engine (https://github.com/gabrielcsapo/miette/pull/3)
  - ensures source has a new line on the end if not appends it
  - improves rendering snippet logic
  - allow rendering multiple snippets per line
  - snippets will get a color blind friendly color to distinguish themselves on the line
  - snippet block now closes the block
  - use unicode if supported, but fallback to ascii if not
  - renders link if provided
  - line width is computed correctly instead of always being 0

# 0.0.1

- @gabrielcsapo: basic functionality support and CI set up!
