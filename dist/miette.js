"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MietteError = exports.miette = void 0;
const reporter_1 = require("./reporter");
const diagnostic_1 = require("./diagnostic");
const theme_1 = require("./theme");
function isUnicodeSupported() {
    if (process.platform !== "win32") {
        return process.env.TERM !== "linux"; // Linux console (kernel)
    }
    return (Boolean(process.env.CI) ||
        Boolean(process.env.WT_SESSION) || // Windows Terminal
        process.env.ConEmuTask === "{cmd::Cmder}" || // ConEmu and cmder
        process.env.TERM_PROGRAM === "vscode" ||
        process.env.TERM === "xterm-256color" ||
        process.env.TERM === "alacritty");
}
/**
 * Miette Decorator function to be used on Error
 * @param code - error code
 * @param source - raw source that miette needs to annotate
 * @returns
 * @example
    ```
    @miette(
      "foo::bar::baz",
      prettier.format(FooBarBaz.toString(), { parser: "babel" })
    )
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
    ```
 */
function miette(code, source) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/ban-types
    return function (constructor) {
        const capturedStack = {};
        return class extends constructor {
            constructor() {
                super(...arguments);
                this.stackHolder = Error.captureStackTrace(capturedStack, this.constructor);
                this.name = code;
                this.stack = MietteError({
                    // @ts-ignore
                    error: this,
                    source: source,
                    // @ts-ignore
                    message: this.message,
                    // @ts-ignore
                    snippets: this.snippets,
                    // @ts-ignore
                    diagnostic: this.diagnostic,
                });
            }
        };
    };
}
exports.miette = miette;
/**
 *
 * @param error
 * @returns
 */
function MietteError(error) {
    const diagnostic = new diagnostic_1.Diagnostic(error);
    const reporter = new reporter_1.Reporter(diagnostic, isUnicodeSupported() ? theme_1.Theme.unicode().styles : theme_1.Theme.ascii().styles, isUnicodeSupported() ? theme_1.Theme.unicode().characters : theme_1.Theme.ascii().characters);
    reporter.render();
    return reporter.debugString;
}
exports.MietteError = MietteError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlldHRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21pZXR0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx5Q0FBc0M7QUFDdEMsNkNBQTBDO0FBQzFDLG1DQUFnQztBQUVoQyxTQUFTLGtCQUFrQjtJQUN6QixJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxFQUFFO1FBQ2hDLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLENBQUMseUJBQXlCO0tBQy9EO0lBRUQsT0FBTyxDQUNMLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUN2QixPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxtQkFBbUI7UUFDdEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEtBQUssY0FBYyxJQUFJLG1CQUFtQjtRQUNoRSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksS0FBSyxRQUFRO1FBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLGdCQUFnQjtRQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxXQUFXLENBQ2pDLENBQUM7QUFDSixDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUNILFNBQWdCLE1BQU0sQ0FBQyxJQUFZLEVBQUUsTUFBYztJQUNqRCwrSUFBK0k7SUFDL0ksT0FBTyxVQUFrRCxXQUFjO1FBQ3JFLE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUN6QixPQUFPLEtBQU0sU0FBUSxXQUFXO1lBQXpCOztnQkFDTCxnQkFBVyxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUV2RSxTQUFJLEdBQUcsSUFBSSxDQUFDO2dCQUNaLFVBQUssR0FBRyxXQUFXLENBQUM7b0JBQ2xCLGFBQWE7b0JBQ2IsS0FBSyxFQUFFLElBQUk7b0JBQ1gsTUFBTSxFQUFFLE1BQU07b0JBQ2QsYUFBYTtvQkFDYixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87b0JBQ3JCLGFBQWE7b0JBQ2IsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO29CQUN2QixhQUFhO29CQUNiLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtpQkFDNUIsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztTQUFBLENBQUM7SUFDSixDQUFDLENBQUM7QUFDSixDQUFDO0FBckJELHdCQXFCQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixXQUFXLENBQUMsS0FBYTtJQUN2QyxNQUFNLFVBQVUsR0FBRyxJQUFJLHVCQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDekMsTUFBTSxRQUFRLEdBQUcsSUFBSSxtQkFBUSxDQUMzQixVQUFVLEVBQ1Ysa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsYUFBSyxDQUFDLEtBQUssRUFBRSxDQUFDLE1BQU0sRUFDcEUsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsYUFBSyxDQUFDLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FDN0UsQ0FBQztJQUVGLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUVsQixPQUFPLFFBQVEsQ0FBQyxXQUFXLENBQUM7QUFDOUIsQ0FBQztBQVhELGtDQVdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUVycm9yIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IFJlcG9ydGVyIH0gZnJvbSBcIi4vcmVwb3J0ZXJcIjtcbmltcG9ydCB7IERpYWdub3N0aWMgfSBmcm9tIFwiLi9kaWFnbm9zdGljXCI7XG5pbXBvcnQgeyBUaGVtZSB9IGZyb20gXCIuL3RoZW1lXCI7XG5cbmZ1bmN0aW9uIGlzVW5pY29kZVN1cHBvcnRlZCgpIHtcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09IFwid2luMzJcIikge1xuICAgIHJldHVybiBwcm9jZXNzLmVudi5URVJNICE9PSBcImxpbnV4XCI7IC8vIExpbnV4IGNvbnNvbGUgKGtlcm5lbClcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgQm9vbGVhbihwcm9jZXNzLmVudi5DSSkgfHxcbiAgICBCb29sZWFuKHByb2Nlc3MuZW52LldUX1NFU1NJT04pIHx8IC8vIFdpbmRvd3MgVGVybWluYWxcbiAgICBwcm9jZXNzLmVudi5Db25FbXVUYXNrID09PSBcIntjbWQ6OkNtZGVyfVwiIHx8IC8vIENvbkVtdSBhbmQgY21kZXJcbiAgICBwcm9jZXNzLmVudi5URVJNX1BST0dSQU0gPT09IFwidnNjb2RlXCIgfHxcbiAgICBwcm9jZXNzLmVudi5URVJNID09PSBcInh0ZXJtLTI1NmNvbG9yXCIgfHxcbiAgICBwcm9jZXNzLmVudi5URVJNID09PSBcImFsYWNyaXR0eVwiXG4gICk7XG59XG5cbi8qKlxuICogTWlldHRlIERlY29yYXRvciBmdW5jdGlvbiB0byBiZSB1c2VkIG9uIEVycm9yXG4gKiBAcGFyYW0gY29kZSAtIGVycm9yIGNvZGVcbiAqIEBwYXJhbSBzb3VyY2UgLSByYXcgc291cmNlIHRoYXQgbWlldHRlIG5lZWRzIHRvIGFubm90YXRlXG4gKiBAcmV0dXJuc1xuICogQGV4YW1wbGVcbiAgICBgYGBcbiAgICBAbWlldHRlKFxuICAgICAgXCJmb286OmJhcjo6YmF6XCIsXG4gICAgICBwcmV0dGllci5mb3JtYXQoRm9vQmFyQmF6LnRvU3RyaW5nKCksIHsgcGFyc2VyOiBcImJhYmVsXCIgfSlcbiAgICApXG4gICAgY2xhc3MgU2hvdWxkQmVGYWxzZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgICAgZGlhZ25vc3RpYyA9IHtcbiAgICAgICAgaGVscDogXCJQbGVhc2UgY29uc3VsdCB0aGUgZ3VpZGVzIGF0IGh0dHA6Ly9naXRodWIuY29tL2Zvby9iYXIjZ3VpZGVzXCIsXG4gICAgICB9O1xuXG4gICAgICBzbmlwcGV0cyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIGNvbnRleHQ6IFwiaWYgKHRydWUpXCIsXG4gICAgICAgICAgaGlnaGxpZ2h0OiBcIlRoaXMgd2lsbCBhbHdheXMgYmUgY2FsbGVkXCIsXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH1cbiAgICBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1pZXR0ZShjb2RlOiBzdHJpbmcsIHNvdXJjZTogc3RyaW5nKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55LCBAdHlwZXNjcmlwdC1lc2xpbnQvZXhwbGljaXQtbW9kdWxlLWJvdW5kYXJ5LXR5cGVzLCBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXR5cGVzXG4gIHJldHVybiBmdW5jdGlvbiA8VCBleHRlbmRzIHsgbmV3ICguLi5hcmdzOiBhbnlbXSk6IHt9IH0+KGNvbnN0cnVjdG9yOiBUKSB7XG4gICAgY29uc3QgY2FwdHVyZWRTdGFjayA9IHt9O1xuICAgIHJldHVybiBjbGFzcyBleHRlbmRzIGNvbnN0cnVjdG9yIHtcbiAgICAgIHN0YWNrSG9sZGVyID0gRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UoY2FwdHVyZWRTdGFjaywgdGhpcy5jb25zdHJ1Y3Rvcik7XG5cbiAgICAgIG5hbWUgPSBjb2RlO1xuICAgICAgc3RhY2sgPSBNaWV0dGVFcnJvcih7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZXJyb3I6IHRoaXMsXG4gICAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBzbmlwcGV0czogdGhpcy5zbmlwcGV0cyxcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBkaWFnbm9zdGljOiB0aGlzLmRpYWdub3N0aWMsXG4gICAgICB9KTtcbiAgICB9O1xuICB9O1xufVxuXG4vKipcbiAqIFxuICogQHBhcmFtIGVycm9yIFxuICogQHJldHVybnMgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBNaWV0dGVFcnJvcihlcnJvcjogSUVycm9yKTogc3RyaW5nIHtcbiAgY29uc3QgZGlhZ25vc3RpYyA9IG5ldyBEaWFnbm9zdGljKGVycm9yKTtcbiAgY29uc3QgcmVwb3J0ZXIgPSBuZXcgUmVwb3J0ZXIoXG4gICAgZGlhZ25vc3RpYyxcbiAgICBpc1VuaWNvZGVTdXBwb3J0ZWQoKSA/IFRoZW1lLnVuaWNvZGUoKS5zdHlsZXMgOiBUaGVtZS5hc2NpaSgpLnN0eWxlcyxcbiAgICBpc1VuaWNvZGVTdXBwb3J0ZWQoKSA/IFRoZW1lLnVuaWNvZGUoKS5jaGFyYWN0ZXJzIDogVGhlbWUuYXNjaWkoKS5jaGFyYWN0ZXJzXG4gICk7XG5cbiAgcmVwb3J0ZXIucmVuZGVyKCk7XG5cbiAgcmV0dXJuIHJlcG9ydGVyLmRlYnVnU3RyaW5nO1xufVxuIl19