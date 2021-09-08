import { Chalk } from "chalk";

import { Diagnostic } from "./diagnostic";
import { GraphicalTheme, IThemeStyle, IThemeCharacters } from "./theme";
import { IError, ISnippet } from "./types";

interface ILine {
  line_number: number;
  offset: number;
  length: number;
  text: string;
}
export class GraphicalReportHandler {
  theme: {
    style: IThemeStyle;
    characters: IThemeCharacters;
  };

  diagnostic: Diagnostic;

  constructor(diagnostic: Diagnostic) {
    const unicode = GraphicalTheme.unicode();

    this.diagnostic = diagnostic;
    this.theme = {
      style: unicode.styles,
      characters: unicode.characters,
    };
  }

  write(str: string): void {
    process.stdout.write(str);
  }

  writeLine(str: string): void {
    process.stdout.write(str + "\n");
  }

  severityStyle(): Chalk {
    if (this.diagnostic.severity === "WARNING") {
      return this.theme.style.warning;
    }

    if (this.diagnostic.severity === "ADVICE") {
      return this.theme.style.advice;
    }

    return this.theme.style.error;
  }

  getLines(str: string): ILine[] {
    let line = 0;
    let column = 0;
    let offset = 0;
    let line_offset = 0;

    let line_str = "";
    let lines: ILine[] = [];

    const iter = str.split("");

    iter.forEach((c, i) => {
      let at_end_of_file = iter.length === i + 1;

      if (c === "\r") {
        if (iter[i + 1] === "\n") {
          offset += 1;
          line += 1;
          column = 0;
        } else {
          line_str += c;
          column += 1;
        }
      }

      if (c === "\n") {
        line += 1;
        column = 0;
      }

      if (c !== "\n" && c !== "\r") {
        line_str += c;
        column += 1;
      }

      if (c === " ") {
        line_offset += 1;
      }

      if (iter[i + 1] === "" && !at_end_of_file) {
        line += 1;
      }

      if (column === 0 || iter[i + 1] === "") {
        lines.push({
          line_number: line,
          offset: line_offset,
          length: line_str.length - line_offset,
          text: line_str,
        });
        line_str = "";
        line_offset = offset;
      }
    });

    return lines;
  }

  render(): void {
    this.render_header();
    this.render_cause();

    this.diagnostic.snippets.forEach((snippet) => {
      this.writeLine("");
      this.render_snippet(snippet);
    });

    this.render_footer();
  }

  render_header(): void {
    this.write(this.theme.characters.hbar.repeat(4));
    this.write(` [${this.theme.style.code(this.diagnostic.functionName)}] `);
    this.writeLine(this.theme.characters.hbar.repeat(20));
  }

  render_cause(): void {
    const severityStyle = this.severityStyle();

    if (this.diagnostic.error) {
      this.writeLine(
        severityStyle(
          `${this.theme.characters.lbot}${this.theme.characters.hbar}${this.theme.characters.rarrow} ${this.diagnostic.error.message}`
        )
      );
    }
  }

  render_snippet(snippet: ISnippet): void {
    const severityStyle = this.severityStyle();

    const lines = this.getLines(this.diagnostic.source);
    const lineWidth = lines.map((line) => line.line_number).sort()[0];

    this.write(
      `${" ".repeat(lineWidth + 2)}${
        this.theme.characters.ltop
      }${this.theme.characters.hbar.repeat(3)}`
    );

    // if we have a name for the snippet we should use that
    this.write(`[${this.diagnostic.fileAndLineNumber}]`);
    this.writeLine("");

    lines.forEach((line, i) => {
      const gutterAndLineNumberOffset = lineWidth;

      this.writeLine(
        ` ${i} ${" ".repeat(lineWidth - i.toString().length)}${
          this.theme.characters.vbar
        } ${line.text}`
      );

      if (line.text.trim() === snippet.context) {
        const offset =
          gutterAndLineNumberOffset + line.offset + line.length - 4;

        this.write(`${" ".repeat(3)}${this.theme.characters.vbar}`);

        this.writeLine(
          severityStyle(
            `${" ".repeat(offset)}${this.theme.characters.hbar.repeat(
              snippet.context.length - 2
            )}${this.theme.characters.mtop}${this.theme.characters.hbar}`
          )
        );
        this.write(`${" ".repeat(3)}${this.theme.characters.vbar}`);

        this.write(
          severityStyle(
            `${" ".repeat(offset + snippet.context.length - 2)}${
              this.theme.characters.lbot
            }${this.theme.characters.underline.repeat(2)}`
          )
        );
        this.write(severityStyle(snippet.highlight));
      }
    });
  }

  render_footer(): void {
    if (this.diagnostic.help) {
      this.writeLine("");
      this.write(this.theme.characters.fyi + " ");
      this.writeLine(this.theme.style.help(this.diagnostic.help));
    }
  }
}
