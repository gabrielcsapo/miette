"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Diagnostic = void 0;
const error_stack_parser_1 = __importDefault(require("error-stack-parser"));
class Diagnostic {
    constructor(error) {
        this.error = error;
    }
    get message() {
        var _a;
        return ((_a = this.error) === null || _a === void 0 ? void 0 : _a.message) || this.error.error.message;
    }
    get help() {
        var _a;
        return (_a = this.error.diagnostic) === null || _a === void 0 ? void 0 : _a.help;
    }
    get functionName() {
        if (this.error.error.name)
            return this.error.error.name;
        const parsedErrorStack = error_stack_parser_1.default.parse(this.error.error);
        return parsedErrorStack[0].functionName;
    }
    get code() {
        return this.error.error.name;
    }
    get url() {
        var _a;
        return (_a = this.error.diagnostic) === null || _a === void 0 ? void 0 : _a.url;
    }
    get snippets() {
        return this.error.snippets;
    }
    get fileAndLineNumber() {
        var _a;
        const parsedErrorStack = error_stack_parser_1.default.parse(this.error.error);
        const lastStack = parsedErrorStack[0];
        return `${(_a = lastStack.fileName) === null || _a === void 0 ? void 0 : _a.substring(lastStack.fileName.lastIndexOf("/") + 1, lastStack.fileName.length)}:${lastStack.lineNumber}:${lastStack.columnNumber}`;
    }
    get source() {
        // Ensure that we append a new line to the end of the source if it doesn't already have one.
        return (this.error.source +
            (this.error.source[this.error.source.length] === "\n" ? "" : "\n"));
    }
    get severity() {
        return this.error.severity || "ERROR";
    }
}
exports.Diagnostic = Diagnostic;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhZ25vc3RpYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9kaWFnbm9zdGljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDRFQUFrRDtBQUlsRCxNQUFhLFVBQVU7SUFFckIsWUFBWSxLQUFhO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxJQUFJLE9BQU87O1FBQ1QsT0FBTyxDQUFBLE1BQUEsSUFBSSxDQUFDLEtBQUssMENBQUUsT0FBTyxLQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztJQUN6RCxDQUFDO0lBRUQsSUFBSSxJQUFJOztRQUNOLE9BQU8sTUFBQSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsMENBQUUsSUFBSSxDQUFDO0lBQ3JDLENBQUM7SUFFRCxJQUFJLFlBQVk7UUFDZCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUk7WUFBRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztRQUV4RCxNQUFNLGdCQUFnQixHQUFHLDRCQUFnQixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWxFLE9BQU8sZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDO0lBQzFDLENBQUM7SUFFRCxJQUFJLElBQUk7UUFDTixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUMvQixDQUFDO0lBRUQsSUFBSSxHQUFHOztRQUNMLE9BQU8sTUFBQSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsMENBQUUsR0FBRyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFFRCxJQUFJLGlCQUFpQjs7UUFDbkIsTUFBTSxnQkFBZ0IsR0FBRyw0QkFBZ0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsRSxNQUFNLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0QyxPQUFPLEdBQUcsTUFBQSxTQUFTLENBQUMsUUFBUSwwQ0FBRSxTQUFTLENBQ3JDLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFDdkMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQzFCLElBQUksU0FBUyxDQUFDLFVBQVUsSUFBSSxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDeEQsQ0FBQztJQUVELElBQUksTUFBTTtRQUNSLDRGQUE0RjtRQUM1RixPQUFPLENBQ0wsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO1lBQ2pCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUNuRSxDQUFDO0lBQ0osQ0FBQztJQUVELElBQUksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDO0lBQ3hDLENBQUM7Q0FDRjtBQXZERCxnQ0F1REMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXJyb3JTdGFja1BhcnNlciBmcm9tIFwiZXJyb3Itc3RhY2stcGFyc2VyXCI7XG5cbmltcG9ydCB7IElFcnJvciwgU2V2ZXJpdHkgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5leHBvcnQgY2xhc3MgRGlhZ25vc3RpYyB7XG4gIGVycm9yOiBJRXJyb3I7XG4gIGNvbnN0cnVjdG9yKGVycm9yOiBJRXJyb3IpIHtcbiAgICB0aGlzLmVycm9yID0gZXJyb3I7XG4gIH1cblxuICBnZXQgbWVzc2FnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5lcnJvcj8ubWVzc2FnZSB8fCB0aGlzLmVycm9yLmVycm9yLm1lc3NhZ2U7XG4gIH1cblxuICBnZXQgaGVscCgpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLmVycm9yLmRpYWdub3N0aWM/LmhlbHA7XG4gIH1cblxuICBnZXQgZnVuY3Rpb25OYW1lKCkge1xuICAgIGlmICh0aGlzLmVycm9yLmVycm9yLm5hbWUpIHJldHVybiB0aGlzLmVycm9yLmVycm9yLm5hbWU7XG5cbiAgICBjb25zdCBwYXJzZWRFcnJvclN0YWNrID0gRXJyb3JTdGFja1BhcnNlci5wYXJzZSh0aGlzLmVycm9yLmVycm9yKTtcblxuICAgIHJldHVybiBwYXJzZWRFcnJvclN0YWNrWzBdLmZ1bmN0aW9uTmFtZTtcbiAgfVxuXG4gIGdldCBjb2RlKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuZXJyb3IuZXJyb3IubmFtZTtcbiAgfVxuXG4gIGdldCB1cmwoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5lcnJvci5kaWFnbm9zdGljPy51cmw7XG4gIH1cblxuICBnZXQgc25pcHBldHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXJyb3Iuc25pcHBldHM7XG4gIH1cblxuICBnZXQgZmlsZUFuZExpbmVOdW1iZXIoKSB7XG4gICAgY29uc3QgcGFyc2VkRXJyb3JTdGFjayA9IEVycm9yU3RhY2tQYXJzZXIucGFyc2UodGhpcy5lcnJvci5lcnJvcik7XG4gICAgY29uc3QgbGFzdFN0YWNrID0gcGFyc2VkRXJyb3JTdGFja1swXTtcblxuICAgIHJldHVybiBgJHtsYXN0U3RhY2suZmlsZU5hbWU/LnN1YnN0cmluZyhcbiAgICAgIGxhc3RTdGFjay5maWxlTmFtZS5sYXN0SW5kZXhPZihcIi9cIikgKyAxLFxuICAgICAgbGFzdFN0YWNrLmZpbGVOYW1lLmxlbmd0aFxuICAgICl9OiR7bGFzdFN0YWNrLmxpbmVOdW1iZXJ9OiR7bGFzdFN0YWNrLmNvbHVtbk51bWJlcn1gO1xuICB9XG5cbiAgZ2V0IHNvdXJjZSgpIHtcbiAgICAvLyBFbnN1cmUgdGhhdCB3ZSBhcHBlbmQgYSBuZXcgbGluZSB0byB0aGUgZW5kIG9mIHRoZSBzb3VyY2UgaWYgaXQgZG9lc24ndCBhbHJlYWR5IGhhdmUgb25lLlxuICAgIHJldHVybiAoXG4gICAgICB0aGlzLmVycm9yLnNvdXJjZSArXG4gICAgICAodGhpcy5lcnJvci5zb3VyY2VbdGhpcy5lcnJvci5zb3VyY2UubGVuZ3RoXSA9PT0gXCJcXG5cIiA/IFwiXCIgOiBcIlxcblwiKVxuICAgICk7XG4gIH1cblxuICBnZXQgc2V2ZXJpdHkoKTogU2V2ZXJpdHkge1xuICAgIHJldHVybiB0aGlzLmVycm9yLnNldmVyaXR5IHx8IFwiRVJST1JcIjtcbiAgfVxufVxuIl19