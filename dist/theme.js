"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme = exports.ThemeStyle = exports.ThemeCharacters = void 0;
const chalk_1 = __importDefault(require("chalk"));
exports.ThemeCharacters = {
    /// Fancy unicode-based graphical elements.
    unicode() {
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
    ascii() {
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
exports.ThemeStyle = {
    error: chalk_1.default.rgb(172, 65, 66),
    warning: chalk_1.default.rgb(244, 191, 117),
    advice: chalk_1.default.rgb(106, 159, 181),
    code: chalk_1.default.rgb(170, 117, 159),
    help: chalk_1.default.rgb(106, 159, 181),
    filename: chalk_1.default.underline.bold.rgb(117, 181, 170),
    highlights: [
        chalk_1.default.rgb(255, 135, 162),
        chalk_1.default.rgb(150, 232, 133),
        chalk_1.default.rgb(62, 238, 210),
        chalk_1.default.rgb(234, 207, 182),
        chalk_1.default.rgb(130, 221, 255),
        chalk_1.default.rgb(255, 188, 242),
    ],
};
exports.Theme = {
    ascii() {
        return {
            characters: exports.ThemeCharacters.ascii(),
            styles: exports.ThemeStyle,
        };
    },
    unicode() {
        return {
            characters: exports.ThemeCharacters.unicode(),
            styles: exports.ThemeStyle,
        };
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdGhlbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsa0RBQTBCO0FBSWIsUUFBQSxlQUFlLEdBQUc7SUFDN0IsMkNBQTJDO0lBQzNDLE9BQU87UUFDTCxPQUFPO1lBQ0wsSUFBSSxFQUFFLEdBQUc7WUFDVCxJQUFJLEVBQUUsR0FBRztZQUNULElBQUksRUFBRSxHQUFHO1lBQ1QsVUFBVSxFQUFFLEdBQUc7WUFDZixNQUFNLEVBQUUsR0FBRztZQUNYLE1BQU0sRUFBRSxHQUFHO1lBQ1gsSUFBSSxFQUFFLEdBQUc7WUFDVCxJQUFJLEVBQUUsR0FBRztZQUNULElBQUksRUFBRSxHQUFHO1lBQ1QsSUFBSSxFQUFFLEdBQUc7WUFDVCxJQUFJLEVBQUUsR0FBRztZQUNULElBQUksRUFBRSxHQUFHO1lBQ1QsSUFBSSxFQUFFLEdBQUc7WUFDVCxJQUFJLEVBQUUsR0FBRztZQUNULE1BQU0sRUFBRSxHQUFHO1lBQ1gsTUFBTSxFQUFFLEdBQUc7WUFDWCxRQUFRLEVBQUUsR0FBRztZQUNiLFNBQVMsRUFBRSxHQUFHO1lBQ2QsR0FBRyxFQUFFLEdBQUc7WUFDUixDQUFDLEVBQUUsR0FBRztZQUNOLE9BQU8sRUFBRSxHQUFHO1lBQ1osV0FBVyxFQUFFLEdBQUc7U0FDakIsQ0FBQztJQUNKLENBQUM7SUFFRCxzRUFBc0U7SUFDdEUsS0FBSztRQUNILE9BQU87WUFDTCxJQUFJLEVBQUUsR0FBRztZQUNULElBQUksRUFBRSxHQUFHO1lBQ1QsSUFBSSxFQUFFLEdBQUc7WUFDVCxVQUFVLEVBQUUsR0FBRztZQUNmLE1BQU0sRUFBRSxHQUFHO1lBQ1gsTUFBTSxFQUFFLEdBQUc7WUFDWCxJQUFJLEVBQUUsR0FBRztZQUNULElBQUksRUFBRSxHQUFHO1lBQ1QsSUFBSSxFQUFFLEdBQUc7WUFDVCxJQUFJLEVBQUUsR0FBRztZQUNULElBQUksRUFBRSxHQUFHO1lBQ1QsSUFBSSxFQUFFLEdBQUc7WUFDVCxJQUFJLEVBQUUsR0FBRztZQUNULElBQUksRUFBRSxHQUFHO1lBQ1QsTUFBTSxFQUFFLEdBQUc7WUFDWCxNQUFNLEVBQUUsR0FBRztZQUNYLFFBQVEsRUFBRSxHQUFHO1lBQ2IsU0FBUyxFQUFFLEdBQUc7WUFDZCxHQUFHLEVBQUUsR0FBRztZQUNSLENBQUMsRUFBRSxHQUFHO1lBQ04sT0FBTyxFQUFFLEdBQUc7WUFDWixXQUFXLEVBQUUsR0FBRztTQUNqQixDQUFDO0lBQ0osQ0FBQztDQUNGLENBQUM7QUFFVyxRQUFBLFVBQVUsR0FBZ0I7SUFDckMsS0FBSyxFQUFFLGVBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFDN0IsT0FBTyxFQUFFLGVBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDakMsTUFBTSxFQUFFLGVBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDaEMsSUFBSSxFQUFFLGVBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDOUIsSUFBSSxFQUFFLGVBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDOUIsUUFBUSxFQUFFLGVBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUNqRCxVQUFVLEVBQUU7UUFDVixlQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1FBQ3hCLGVBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7UUFDeEIsZUFBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztRQUN2QixlQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1FBQ3hCLGVBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7UUFDeEIsZUFBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztLQUN6QjtDQUNGLENBQUM7QUFFVyxRQUFBLEtBQUssR0FBRztJQUNuQixLQUFLO1FBQ0gsT0FBTztZQUNMLFVBQVUsRUFBRSx1QkFBZSxDQUFDLEtBQUssRUFBRTtZQUNuQyxNQUFNLEVBQUUsa0JBQVU7U0FDbkIsQ0FBQztJQUNKLENBQUM7SUFFRCxPQUFPO1FBQ0wsT0FBTztZQUNMLFVBQVUsRUFBRSx1QkFBZSxDQUFDLE9BQU8sRUFBRTtZQUNyQyxNQUFNLEVBQUUsa0JBQVU7U0FDbkIsQ0FBQztJQUNKLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNoYWxrIGZyb20gXCJjaGFsa1wiO1xuXG5pbXBvcnQgeyBJVGhlbWVDaGFyYWN0ZXJzLCBJVGhlbWVTdHlsZSB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmV4cG9ydCBjb25zdCBUaGVtZUNoYXJhY3RlcnMgPSB7XG4gIC8vLyBGYW5jeSB1bmljb2RlLWJhc2VkIGdyYXBoaWNhbCBlbGVtZW50cy5cbiAgdW5pY29kZSgpOiBJVGhlbWVDaGFyYWN0ZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGJhcjogXCLilIBcIixcbiAgICAgIHZiYXI6IFwi4pSCXCIsXG4gICAgICB4YmFyOiBcIuKUvFwiLFxuICAgICAgdmJhcl9icmVhazogXCLCt1wiLFxuICAgICAgdWFycm93OiBcIuKWslwiLFxuICAgICAgcmFycm93OiBcIuKWtlwiLFxuICAgICAgbHRvcDogXCLila1cIixcbiAgICAgIG10b3A6IFwi4pSsXCIsXG4gICAgICBydG9wOiBcIuKVrlwiLFxuICAgICAgbGJvdDogXCLilbBcIixcbiAgICAgIG1ib3Q6IFwi4pS0XCIsXG4gICAgICByYm90OiBcIuKVr1wiLFxuICAgICAgbGJveDogXCJbXCIsXG4gICAgICByYm94OiBcIl1cIixcbiAgICAgIGxjcm9zczogXCLilJxcIixcbiAgICAgIHJjcm9zczogXCLilKRcIixcbiAgICAgIHVuZGVyYmFyOiBcIuKUrFwiLFxuICAgICAgdW5kZXJsaW5lOiBcIuKUgFwiLFxuICAgICAgZnlpOiBcIuKAvVwiLFxuICAgICAgeDogXCLDl1wiLFxuICAgICAgd2FybmluZzogXCLimqBcIixcbiAgICAgIHBvaW50X3JpZ2h0OiBcIuKYnlwiLFxuICAgIH07XG4gIH0sXG5cbiAgLy8vIEFTQ0lJLWFydC1iYXNlZCBncmFwaGljYWwgZWxlbWVudHMuIFdvcmtzIHdlbGwgb24gb2xkZXIgdGVybWluYWxzLlxuICBhc2NpaSgpOiBJVGhlbWVDaGFyYWN0ZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGJhcjogXCItXCIsXG4gICAgICB2YmFyOiBcInxcIixcbiAgICAgIHhiYXI6IFwiK1wiLFxuICAgICAgdmJhcl9icmVhazogXCI6XCIsXG4gICAgICB1YXJyb3c6IFwiXlwiLFxuICAgICAgcmFycm93OiBcIj5cIixcbiAgICAgIGx0b3A6IFwiLFwiLFxuICAgICAgbXRvcDogXCJ2XCIsXG4gICAgICBydG9wOiBcIi5cIixcbiAgICAgIGxib3Q6IFwiYFwiLFxuICAgICAgbWJvdDogXCJeXCIsXG4gICAgICByYm90OiBcIidcIixcbiAgICAgIGxib3g6IFwiW1wiLFxuICAgICAgcmJveDogXCJdXCIsXG4gICAgICBsY3Jvc3M6IFwifFwiLFxuICAgICAgcmNyb3NzOiBcInxcIixcbiAgICAgIHVuZGVyYmFyOiBcInxcIixcbiAgICAgIHVuZGVybGluZTogXCJeXCIsXG4gICAgICBmeWk6IFwiaVwiLFxuICAgICAgeDogXCJ4XCIsXG4gICAgICB3YXJuaW5nOiBcIiFcIixcbiAgICAgIHBvaW50X3JpZ2h0OiBcIj5cIixcbiAgICB9O1xuICB9LFxufTtcblxuZXhwb3J0IGNvbnN0IFRoZW1lU3R5bGU6IElUaGVtZVN0eWxlID0ge1xuICBlcnJvcjogY2hhbGsucmdiKDE3MiwgNjUsIDY2KSxcbiAgd2FybmluZzogY2hhbGsucmdiKDI0NCwgMTkxLCAxMTcpLFxuICBhZHZpY2U6IGNoYWxrLnJnYigxMDYsIDE1OSwgMTgxKSxcbiAgY29kZTogY2hhbGsucmdiKDE3MCwgMTE3LCAxNTkpLFxuICBoZWxwOiBjaGFsay5yZ2IoMTA2LCAxNTksIDE4MSksXG4gIGZpbGVuYW1lOiBjaGFsay51bmRlcmxpbmUuYm9sZC5yZ2IoMTE3LCAxODEsIDE3MCksXG4gIGhpZ2hsaWdodHM6IFtcbiAgICBjaGFsay5yZ2IoMjU1LCAxMzUsIDE2MiksXG4gICAgY2hhbGsucmdiKDE1MCwgMjMyLCAxMzMpLFxuICAgIGNoYWxrLnJnYig2MiwgMjM4LCAyMTApLFxuICAgIGNoYWxrLnJnYigyMzQsIDIwNywgMTgyKSxcbiAgICBjaGFsay5yZ2IoMTMwLCAyMjEsIDI1NSksXG4gICAgY2hhbGsucmdiKDI1NSwgMTg4LCAyNDIpLFxuICBdLFxufTtcblxuZXhwb3J0IGNvbnN0IFRoZW1lID0ge1xuICBhc2NpaSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY2hhcmFjdGVyczogVGhlbWVDaGFyYWN0ZXJzLmFzY2lpKCksXG4gICAgICBzdHlsZXM6IFRoZW1lU3R5bGUsXG4gICAgfTtcbiAgfSxcblxuICB1bmljb2RlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjaGFyYWN0ZXJzOiBUaGVtZUNoYXJhY3RlcnMudW5pY29kZSgpLFxuICAgICAgc3R5bGVzOiBUaGVtZVN0eWxlLFxuICAgIH07XG4gIH0sXG59O1xuIl19