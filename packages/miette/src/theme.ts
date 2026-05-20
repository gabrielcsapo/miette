import { bold, compose, rgb, underline } from "./ansi.js"
import type { Theme, ThemeCharacters, ThemeStyle } from "./types.js"

export type { Theme } from "./types.js"

export const unicodeCharacters: ThemeCharacters = {
  hbar: "─",
  vbar: "│",
  xbar: "┼",
  vbar_break: "·",
  uarrow: "▲",
  rarrow: "▶",
  ltop: "╭",
  mtop: "┬",
  rtop: "╮",
  lbot: "╰",
  mbot: "┴",
  rbot: "╯",
  lbox: "[",
  rbox: "]",
  lcross: "├",
  rcross: "┤",
  underbar: "┬",
  underline: "─",
  fyi: "‽",
  x: "×",
  warning: "⚠",
  point_right: "☞",
}

export const asciiCharacters: ThemeCharacters = {
  hbar: "-",
  vbar: "|",
  xbar: "+",
  vbar_break: ":",
  uarrow: "^",
  rarrow: ">",
  ltop: ",",
  mtop: "v",
  rtop: ".",
  lbot: "`",
  mbot: "^",
  rbot: "'",
  lbox: "[",
  rbox: "]",
  lcross: "|",
  rcross: "|",
  underbar: "|",
  underline: "^",
  fyi: "i",
  x: "x",
  warning: "!",
  point_right: ">",
}

export const defaultStyle: ThemeStyle = {
  error: rgb(172, 65, 66),
  warning: rgb(244, 191, 117),
  advice: rgb(106, 159, 181),
  code: rgb(170, 117, 159),
  help: rgb(106, 159, 181),
  filename: compose(rgb(117, 181, 170), underline, bold),
  highlights: [
    rgb(255, 135, 162),
    rgb(150, 232, 133),
    rgb(62, 238, 210),
    rgb(234, 207, 182),
    rgb(130, 221, 255),
    rgb(255, 188, 242),
  ],
}

export function ascii(): Theme {
  return { characters: asciiCharacters, styles: defaultStyle }
}

export function unicode(): Theme {
  return { characters: unicodeCharacters, styles: defaultStyle }
}
