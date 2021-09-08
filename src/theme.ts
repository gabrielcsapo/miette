import chalk, { Chalk } from "chalk";

export interface IThemeCharacters {
  hbar: string;
  vbar: string;
  xbar: string;
  vbar_break: string;
  uarrow: string;
  rarrow: string;
  ltop: string;
  mtop: string;
  rtop: string;
  lbot: string;
  mbot: string;
  rbot: string;
  lbox: string;
  rbox: string;
  lcross: string;
  rcross: string;
  underbar: string;
  underline: string;
  fyi: string;
  x: string;
  warning: string;
  point_right: string;
}

export const ThemeCharacters = {
  /// Fancy unicode-based graphical elements.
  unicode(): IThemeCharacters {
    return {
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
    };
  },

  /// ASCII-art-based graphical elements. Works well on older terminals.
  ascii(): IThemeCharacters {
    return {
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
    };
  },
};

export interface IThemeStyle {
  error: Chalk;
  warning: Chalk;
  advice: Chalk;
  code: Chalk;
  help: Chalk;
  filename: Chalk;
  highlights: Chalk[];
}

export const ThemeStyle: IThemeStyle = {
  error: chalk.rgb(172, 65, 66),
  warning: chalk.rgb(244, 191, 117),
  advice: chalk.rgb(106, 159, 181),
  code: chalk.rgb(170, 117, 159),
  help: chalk.rgb(106, 159, 181),
  filename: chalk.underline.bold.rgb(117, 181, 170),
  highlights: [
    chalk.rgb(255, 135, 162),
    chalk.rgb(150, 232, 133),
    chalk.rgb(62, 238, 210),
    chalk.rgb(234, 207, 182),
    chalk.rgb(130, 221, 255),
    chalk.rgb(255, 188, 242),
  ],
};

export const GraphicalTheme = {
  ascii() {
    return {
      characters: ThemeCharacters.ascii(),
      styles: ThemeStyle,
    };
  },

  unicode() {
    return {
      characters: ThemeCharacters.unicode(),
      styles: ThemeStyle,
    };
  },
};
