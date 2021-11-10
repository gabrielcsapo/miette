"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphicalReportHandler = void 0;
const theme_1 = require("./theme");
function minimumGuard(count, minimum) {
    if (count < minimum) {
        return minimum;
    }
    return count;
}
class GraphicalReportHandler {
    constructor(diagnostic) {
        // This will be used to store the raw output and used in tests for assertions
        this.debugString = "";
        const unicode = theme_1.GraphicalTheme.unicode();
        this.diagnostic = diagnostic;
        this.theme = {
            style: unicode.styles,
            characters: unicode.characters,
        };
    }
    write(str) {
        process.stdout.write(str);
        this.debugString += str;
    }
    writeLine(str) {
        process.stdout.write(str + "\n");
        this.debugString += str + "\n";
    }
    severityStyle() {
        if (this.diagnostic.severity === "WARNING") {
            return this.theme.style.warning;
        }
        if (this.diagnostic.severity === "ADVICE") {
            return this.theme.style.advice;
        }
        return this.theme.style.error;
    }
    getLines(str) {
        let line = 0;
        let column = 0;
        let offset = 0;
        let line_offset = 0;
        let line_str = "";
        const lines = [];
        const iter = str.split("");
        iter.forEach((c, i) => {
            const at_end_of_file = iter.length === i + 1;
            if (c === "\r") {
                if (iter[i + 1] === "\n") {
                    offset += 1;
                    line += 1;
                    column = 0;
                }
                else {
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
    render() {
        this.render_header();
        this.render_cause();
        this.render_snippets();
        this.render_footer();
    }
    render_header() {
        this.write("Error: ");
        this.write(this.theme.characters.hbar.repeat(4));
        this.write(` [${this.theme.style.code(this.diagnostic.functionName)}] `);
        this.writeLine(this.theme.characters.hbar.repeat(20));
    }
    render_cause() {
        const severityStyle = this.severityStyle();
        if (this.diagnostic.error) {
            this.writeLine(severityStyle(`${this.theme.characters.lbot}${this.theme.characters.hbar}${this.theme.characters.rarrow} ${this.diagnostic.error.message}`));
        }
    }
    render_snippets() {
        this.writeLine("");
        const severityStyle = this.severityStyle();
        const lines = this.getLines(this.diagnostic.source);
        const lineWidth = lines.map((line) => line.line_number).sort()[0];
        this.write(`${" ".repeat(lineWidth + 2)}${this.theme.characters.ltop}${this.theme.characters.hbar.repeat(3)}`);
        // if we have a name for the snippet we should use that
        this.write(`[${this.diagnostic.fileAndLineNumber}]`);
        this.writeLine("");
        lines.forEach((line, i) => {
            const gutterAndLineNumberOffset = lineWidth;
            this.writeLine(` ${i} ${" ".repeat(minimumGuard(lineWidth - i.toString().length, 0))}${this.theme.characters.vbar} ${line.text}`);
            this.diagnostic.snippets.forEach((snippet) => {
                // TODO: this should be refactored to be render_snippet
                if (line.text.trim().indexOf(snippet.context) > -1) {
                    const offset = gutterAndLineNumberOffset + line.offset;
                    this.write(`${" ".repeat(3)}${this.theme.characters.vbar_break}`);
                    this.writeLine(severityStyle(`${" ".repeat(offset)}${this.theme.characters.hbar.repeat(snippet.context.length - 2)}${this.theme.characters.mtop}${this.theme.characters.hbar}`));
                    this.write(`${" ".repeat(3)}${this.theme.characters.vbar_break}`);
                    this.write(severityStyle(`${" ".repeat(offset + snippet.context.length - 2)}${this.theme.characters.lbot}${this.theme.characters.underline.repeat(2)}`));
                    this.write(severityStyle(snippet.highlight + "\n"));
                }
            });
        });
    }
    // render_snippet(snippet: ISnippet): void {}
    render_footer() {
        if (this.diagnostic.help) {
            this.writeLine("");
            this.write(this.theme.characters.fyi + " ");
            this.writeLine(this.theme.style.help(this.diagnostic.help));
        }
    }
}
exports.GraphicalReportHandler = GraphicalReportHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBR0EsbUNBQXlDO0FBR3pDLFNBQVMsWUFBWSxDQUFDLEtBQWEsRUFBRSxPQUFlO0lBQ2xELElBQUksS0FBSyxHQUFHLE9BQU8sRUFBRTtRQUNuQixPQUFPLE9BQU8sQ0FBQztLQUNoQjtJQUVELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUNELE1BQWEsc0JBQXNCO0lBV2pDLFlBQVksVUFBc0I7UUFIbEMsNkVBQTZFO1FBQzdFLGdCQUFXLEdBQUcsRUFBRSxDQUFDO1FBR2YsTUFBTSxPQUFPLEdBQUcsc0JBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUV6QyxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHO1lBQ1gsS0FBSyxFQUFFLE9BQU8sQ0FBQyxNQUFNO1lBQ3JCLFVBQVUsRUFBRSxPQUFPLENBQUMsVUFBVTtTQUMvQixDQUFDO0lBQ0osQ0FBQztJQUVELEtBQUssQ0FBQyxHQUFXO1FBQ2YsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFMUIsSUFBSSxDQUFDLFdBQVcsSUFBSSxHQUFHLENBQUM7SUFDMUIsQ0FBQztJQUVELFNBQVMsQ0FBQyxHQUFXO1FBQ25CLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUVqQyxJQUFJLENBQUMsV0FBVyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7SUFDakMsQ0FBQztJQUVELGFBQWE7UUFDWCxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUMxQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztTQUNqQztRQUVELElBQUksSUFBSSxDQUFD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O1lBQzVDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUM3RDtJQUNILENBQUM7Q0FDRjtBQW5NRCx3REFtTUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFsayB9IGZyb20gXCJjaGFsa1wiO1xuXG5pbXBvcnQgeyBEaWFnbm9zdGljIH0gZnJvbSBcIi4vZGlhZ25vc3RpY1wiO1xuaW1wb3J0IHsgR3JhcGhpY2FsVGhlbWUgfSBmcm9tIFwiLi90aGVtZVwiO1xuaW1wb3J0IHsgSVNuaXBwZXQsIElMaW5lLCBJVGhlbWVTdHlsZSwgSVRoZW1lQ2hhcmFjdGVycyB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmZ1bmN0aW9uIG1pbmltdW1HdWFyZChjb3VudDogbnVtYmVyLCBtaW5pbXVtOiBudW1iZXIpIHtcbiAgaWYgKGNvdW50IDwgbWluaW11bSkge1xuICAgIHJldHVybiBtaW5pbXVtO1xuICB9XG5cbiAgcmV0dXJuIGNvdW50O1xufVxuZXhwb3J0IGNsYXNzIEdyYXBoaWNhbFJlcG9ydEhhbmRsZXIge1xuICB0aGVtZToge1xuICAgIHN0eWxlOiBJVGhlbWVTdHlsZTtcbiAgICBjaGFyYWN0ZXJzOiBJVGhlbWVDaGFyYWN0ZXJzO1xuICB9O1xuXG4gIGRpYWdub3N0aWM6IERpYWdub3N0aWM7XG5cbiAgLy8gVGhpcyB3aWxsIGJlIHVzZWQgdG8gc3RvcmUgdGhlIHJhdyBvdXRwdXQgYW5kIHVzZWQgaW4gdGVzdHMgZm9yIGFzc2VydGlvbnNcbiAgZGVidWdTdHJpbmcgPSBcIlwiO1xuXG4gIGNvbnN0cnVjdG9yKGRpYWdub3N0aWM6IERpYWdub3N0aWMpIHtcbiAgICBjb25zdCB1bmljb2RlID0gR3JhcGhpY2FsVGhlbWUudW5pY29kZSgpO1xuXG4gICAgdGhpcy5kaWFnbm9zdGljID0gZGlhZ25vc3RpYztcbiAgICB0aGlzLnRoZW1lID0ge1xuICAgICAgc3R5bGU6IHVuaWNvZGUuc3R5bGVzLFxuICAgICAgY2hhcmFjdGVyczogdW5pY29kZS5jaGFyYWN0ZXJzLFxuICAgIH07XG4gIH1cblxuICB3cml0ZShzdHI6IHN0cmluZyk6IHZvaWQge1xuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHN0cik7XG5cbiAgICB0aGlzLmRlYnVnU3RyaW5nICs9IHN0cjtcbiAgfVxuXG4gIHdyaXRlTGluZShzdHI6IHN0cmluZyk6IHZvaWQge1xuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHN0ciArIFwiXFxuXCIpO1xuXG4gICAgdGhpcy5kZWJ1Z1N0cmluZyArPSBzdHIgKyBcIlxcblwiO1xuICB9XG5cbiAgc2V2ZXJpdHlTdHlsZSgpOiBDaGFsayB7XG4gICAgaWYgKHRoaXMuZGlhZ25vc3RpYy5zZXZlcml0eSA9PT0gXCJXQVJOSU5HXCIpIHtcbiAgICAgIHJldHVybiB0aGlzLnRoZW1lLnN0eWxlLndhcm5pbmc7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGlhZ25vc3RpYy5zZXZlcml0eSA9PT0gXCJBRFZJQ0VcIikge1xuICAgICAgcmV0dXJuIHRoaXMudGhlbWUuc3R5bGUuYWR2aWNlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnRoZW1lLnN0eWxlLmVycm9yO1xuICB9XG5cbiAgZ2V0TGluZXMoc3RyOiBzdHJpbmcpOiBJTGluZVtdIHtcbiAgICBsZXQgbGluZSA9IDA7XG4gICAgbGV0IGNvbHVtbiA9IDA7XG4gICAgbGV0IG9mZnNldCA9IDA7XG4gICAgbGV0IGxpbmVfb2Zmc2V0ID0gMDtcblxuICAgIGxldCBsaW5lX3N0ciA9IFwiXCI7XG4gICAgY29uc3QgbGluZXM6IElMaW5lW10gPSBbXTtcblxuICAgIGNvbnN0IGl0ZXIgPSBzdHIuc3BsaXQoXCJcIik7XG5cbiAgICBpdGVyLmZvckVhY2goKGMsIGkpID0+IHtcbiAgICAgIGNvbnN0IGF0X2VuZF9vZl9maWxlID0gaXRlci5sZW5ndGggPT09IGkgKyAxO1xuXG4gICAgICBpZiAoYyA9PT0gXCJcXHJcIikge1xuICAgICAgICBpZiAoaXRlcltpICsgMV0gPT09IFwiXFxuXCIpIHtcbiAgICAgICAgICBvZmZzZXQgKz0gMTtcbiAgICAgICAgICBsaW5lICs9IDE7XG4gICAgICAgICAgY29sdW1uID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsaW5lX3N0ciArPSBjO1xuICAgICAgICAgIGNvbHVtbiArPSAxO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjID09PSBcIlxcblwiKSB7XG4gICAgICAgIGxpbmUgKz0gMTtcbiAgICAgICAgY29sdW1uID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKGMgIT09IFwiXFxuXCIgJiYgYyAhPT0gXCJcXHJcIikge1xuICAgICAgICBsaW5lX3N0ciArPSBjO1xuICAgICAgICBjb2x1bW4gKz0gMTtcbiAgICAgIH1cblxuICAgICAgaWYgKGMgPT09IFwiIFwiKSB7XG4gICAgICAgIGxpbmVfb2Zmc2V0ICs9IDE7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVyW2kgKyAxXSA9PT0gXCJcIiAmJiAhYXRfZW5kX29mX2ZpbGUpIHtcbiAgICAgICAgbGluZSArPSAxO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29sdW1uID09PSAwIHx8IGl0ZXJbaSArIDFdID09PSBcIlwiKSB7XG4gICAgICAgIGxpbmVzLnB1c2goe1xuICAgICAgICAgIGxpbmVfbnVtYmVyOiBsaW5lLFxuICAgICAgICAgIG9mZnNldDogbGluZV9vZmZzZXQsXG4gICAgICAgICAgbGVuZ3RoOiBsaW5lX3N0ci5sZW5ndGggLSBsaW5lX29mZnNldCxcbiAgICAgICAgICB0ZXh0OiBsaW5lX3N0cixcbiAgICAgICAgfSk7XG4gICAgICAgIGxpbmVfc3RyID0gXCJcIjtcbiAgICAgICAgbGluZV9vZmZzZXQgPSBvZmZzZXQ7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbGluZXM7XG4gIH1cblxuICByZW5kZXIoKTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXJfaGVhZGVyKCk7XG4gICAgdGhpcy5yZW5kZXJfY2F1c2UoKTtcbiAgICB0aGlzLnJlbmRlcl9zbmlwcGV0cygpO1xuICAgIHRoaXMucmVuZGVyX2Zvb3RlcigpO1xuICB9XG5cbiAgcmVuZGVyX2hlYWRlcigpOiB2b2lkIHtcbiAgICB0aGlzLndyaXRlKFwiRXJyb3I6IFwiKTtcbiAgICB0aGlzLndyaXRlKHRoaXMudGhlbWUuY2hhcmFjdGVycy5oYmFyLnJlcGVhdCg0KSk7XG4gICAgdGhpcy53cml0ZShgIFske3RoaXMudGhlbWUuc3R5bGUuY29kZSh0aGlzLmRpYWdub3N0aWMuZnVuY3Rpb25OYW1lKX1dIGApO1xuICAgIHRoaXMud3JpdGVMaW5lKHRoaXMudGhlbWUuY2hhcmFjdGVycy5oYmFyLnJlcGVhdCgyMCkpO1xuICB9XG5cbiAgcmVuZGVyX2NhdXNlKCk6IHZvaWQge1xuICAgIGNvbnN0IHNldmVyaXR5U3R5bGUgPSB0aGlzLnNldmVyaXR5U3R5bGUoKTtcblxuICAgIGlmICh0aGlzLmRpYWdub3N0aWMuZXJyb3IpIHtcbiAgICAgIHRoaXMud3JpdGVMaW5lKFxuICAgICAgICBzZXZlcml0eVN0eWxlKFxuICAgICAgICAgIGAke3RoaXMudGhlbWUuY2hhcmFjdGVycy5sYm90fSR7dGhpcy50aGVtZS5jaGFyYWN0ZXJzLmhiYXJ9JHt0aGlzLnRoZW1lLmNoYXJhY3RlcnMucmFycm93fSAke3RoaXMuZGlhZ25vc3RpYy5lcnJvci5tZXNzYWdlfWBcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJfc25pcHBldHMoKTogdm9pZCB7XG4gICAgdGhpcy53cml0ZUxpbmUoXCJcIik7XG5cbiAgICBjb25zdCBzZXZlcml0eVN0eWxlID0gdGhpcy5zZXZlcml0eVN0eWxlKCk7XG5cbiAgICBjb25zdCBsaW5lcyA9IHRoaXMuZ2V0TGluZXModGhpcy5kaWFnbm9zdGljLnNvdXJjZSk7XG4gICAgY29uc3QgbGluZVdpZHRoID0gbGluZXMubWFwKChsaW5lKSA9PiBsaW5lLmxpbmVfbnVtYmVyKS5zb3J0KClbMF07XG5cbiAgICB0aGlzLndyaXRlKFxuICAgICAgYCR7XCIgXCIucmVwZWF0KGxpbmVXaWR0aCArIDIpfSR7XG4gICAgICAgIHRoaXMudGhlbWUuY2hhcmFjdGVycy5sdG9wXG4gICAgICB9JHt0aGlzLnRoZW1lLmNoYXJhY3RlcnMuaGJhci5yZXBlYXQoMyl9YFxuICAgICk7XG5cbiAgICAvLyBpZiB3ZSBoYXZlIGEgbmFtZSBmb3IgdGhlIHNuaXBwZXQgd2Ugc2hvdWxkIHVzZSB0aGF0XG4gICAgdGhpcy53cml0ZShgWyR7dGhpcy5kaWFnbm9zdGljLmZpbGVBbmRMaW5lTnVtYmVyfV1gKTtcbiAgICB0aGlzLndyaXRlTGluZShcIlwiKTtcblxuICAgIGxpbmVzLmZvckVhY2goKGxpbmUsIGkpID0+IHtcbiAgICAgIGNvbnN0IGd1dHRlckFuZExpbmVOdW1iZXJPZmZzZXQgPSBsaW5lV2lkdGg7XG5cbiAgICAgIHRoaXMud3JpdGVMaW5lKFxuICAgICAgICBgICR7aX0gJHtcIiBcIi5yZXBlYXQobWluaW11bUd1YXJkKGxpbmVXaWR0aCAtIGkudG9TdHJpbmcoKS5sZW5ndGgsIDApKX0ke1xuICAgICAgICAgIHRoaXMudGhlbWUuY2hhcmFjdGVycy52YmFyXG4gICAgICAgIH0gJHtsaW5lLnRleHR9YFxuICAgICAgKTtcblxuICAgICAgdGhpcy5kaWFnbm9zdGljLnNuaXBwZXRzLmZvckVhY2goKHNuaXBwZXQpID0+IHtcbiAgICAgICAgLy8gVE9ETzogdGhpcyBzaG91bGQgYmUgcmVmYWN0b3JlZCB0byBiZSByZW5kZXJfc25pcHBldFxuXG4gICAgICAgIGlmIChsaW5lLnRleHQudHJpbSgpLmluZGV4T2Yoc25pcHBldC5jb250ZXh0KSA+IC0xKSB7XG4gICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gZ3V0dGVyQW5kTGluZU51bWJlck9mZnNldCArIGxpbmUub2Zmc2V0O1xuXG4gICAgICAgICAgdGhpcy53cml0ZShgJHtcIiBcIi5yZXBlYXQoMyl9JHt0aGlzLnRoZW1lLmNoYXJhY3RlcnMudmJhcl9icmVha31gKTtcblxuICAgICAgICAgIHRoaXMud3JpdGVMaW5lKFxuICAgICAgICAgICAgc2V2ZXJpdHlTdHlsZShcbiAgICAgICAgICAgICAgYCR7XCIgXCIucmVwZWF0KG9mZnNldCl9JHt0aGlzLnRoZW1lLmNoYXJhY3RlcnMuaGJhci5yZXBlYXQoXG4gICAgICAgICAgICAgICAgc25pcHBldC5jb250ZXh0Lmxlbmd0aCAtIDJcbiAgICAgICAgICAgICAgKX0ke3RoaXMudGhlbWUuY2hhcmFjdGVycy5tdG9wfSR7dGhpcy50aGVtZS5jaGFyYWN0ZXJzLmhiYXJ9YFxuICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy53cml0ZShgJHtcIiBcIi5yZXBlYXQoMyl9JHt0aGlzLnRoZW1lLmNoYXJhY3RlcnMudmJhcl9icmVha31gKTtcblxuICAgICAgICAgIHRoaXMud3JpdGUoXG4gICAgICAgICAgICBzZXZlcml0eVN0eWxlKFxuICAgICAgICAgICAgICBgJHtcIiBcIi5yZXBlYXQob2Zmc2V0ICsgc25pcHBldC5jb250ZXh0Lmxlbmd0aCAtIDIpfSR7XG4gICAgICAgICAgICAgICAgdGhpcy50aGVtZS5jaGFyYWN0ZXJzLmxib3RcbiAgICAgICAgICAgICAgfSR7dGhpcy50aGVtZS5jaGFyYWN0ZXJzLnVuZGVybGluZS5yZXBlYXQoMil9YFxuICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy53cml0ZShzZXZlcml0eVN0eWxlKHNuaXBwZXQuaGlnaGxpZ2h0ICsgXCJcXG5cIikpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIHJlbmRlcl9zbmlwcGV0KHNuaXBwZXQ6IElTbmlwcGV0KTogdm9pZCB7fVxuXG4gIHJlbmRlcl9mb290ZXIoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGlhZ25vc3RpYy5oZWxwKSB7XG4gICAgICB0aGlzLndyaXRlTGluZShcIlwiKTtcbiAgICAgIHRoaXMud3JpdGUodGhpcy50aGVtZS5jaGFyYWN0ZXJzLmZ5aSArIFwiIFwiKTtcbiAgICAgIHRoaXMud3JpdGVMaW5lKHRoaXMudGhlbWUuc3R5bGUuaGVscCh0aGlzLmRpYWdub3N0aWMuaGVscCkpO1xuICAgIH1cbiAgfVxufVxuIl19