"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.env.FORCE_COLOR = '0';
const prettier_1 = __importDefault(require("prettier"));
const miette_1 = require("./miette");
describe("miette", () => {
    test("should be able to render with decorators", () => {
        let ShouldBeFalseError = class ShouldBeFalseError extends Error {
            constructor() {
                super(...arguments);
                this.diagnostic = {
                    help: "Please consult the guides at http://github.com/foo/bar#guides",
                };
                this.snippets = [
                    {
                        context: "if (true)",
                        highlight: "This will always be called",
                    },
                ];
            }
        };
        ShouldBeFalseError = __decorate([
            (0, miette_1.miette)("foo::bar::baz", prettier_1.default.format(FooBarBaz.toString(), { parser: "babel" }))
        ], ShouldBeFalseError);
        function FooBarBaz() {
            // eslint-disable-next-line no-constant-condition
            if (true) {
                try {
                    throw new ShouldBeFalseError("Should make things dynamic");
                }
                catch (error) {
                    if (error instanceof Error) {
                        console.log(error.stack);
                        expect(error.stack).toMatchSnapshot();
                    }
                }
            }
        }
        FooBarBaz();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlldHRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvbWlldHRlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7QUFFOUIsd0RBQWdDO0FBRWhDLHFDQUFrQztBQUVsQyxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUN0QixJQUFJLENBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO1FBS3BELElBQU0sa0JBQWtCLEdBQXhCLE1BQU0sa0JBQW1CLFNBQVEsS0FBSztZQUF0Qzs7Z0JBQ0UsZUFBVSxHQUFHO29CQUNYLElBQUksRUFBRSwrREFBK0Q7aUJBQ3RFLENBQUM7Z0JBRUYsYUFBUSxHQUFHO29CQUNUO3dCQUNFLE9BQU8sRUFBRSxXQUFXO3dCQUNwQixTQUFTLEVBQUUsNEJBQTRCO3FCQUN4QztpQkFDRixDQUFDO1lBQ0osQ0FBQztTQUFBLENBQUE7UUFYSyxrQkFBa0I7WUFKdkIsSUFBQSxlQUFNLEVBQ0wsZUFBZSxFQUNmLGtCQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUMzRDtXQUNLLGtCQUFrQixDQVd2QjtRQUVELFNBQVMsU0FBUztZQUNoQixpREFBaUQ7WUFDakQsSUFBSSxJQUFJLEVBQUU7Z0JBQ1IsSUFBSTtvQkFDRixNQUFNLElBQUksa0JBQWtCLENBQUMsNEJBQTRCLENBQUMsQ0FBQztpQkFDNUQ7Z0JBQUMsT0FBTyxLQUFLLEVBQUU7b0JBQ2QsSUFBSSxLQUFLLFlBQVksS0FBSyxFQUFFO3dCQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDekIsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztxQkFDdkM7aUJBQ0Y7YUFDRjtRQUNILENBQUM7UUFFRCxTQUFTLEVBQUUsQ0FBQztJQUNkLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJwcm9jZXNzLmVudi5GT1JDRV9DT0xPUiA9ICcwJztcblxuaW1wb3J0IHByZXR0aWVyIGZyb20gXCJwcmV0dGllclwiO1xuXG5pbXBvcnQgeyBtaWV0dGUgfSBmcm9tIFwiLi9taWV0dGVcIjtcblxuZGVzY3JpYmUoXCJtaWV0dGVcIiwgKCkgPT4ge1xuICB0ZXN0KFwic2hvdWxkIGJlIGFibGUgdG8gcmVuZGVyIHdpdGggZGVjb3JhdG9yc1wiLCAoKSA9PiB7XG4gICAgQG1pZXR0ZShcbiAgICAgIFwiZm9vOjpiYXI6OmJhelwiLFxuICAgICAgcHJldHRpZXIuZm9ybWF0KEZvb0JhckJhei50b1N0cmluZygpLCB7IHBhcnNlcjogXCJiYWJlbFwiIH0pXG4gICAgKVxuICAgIGNsYXNzIFNob3VsZEJlRmFsc2VFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICAgIGRpYWdub3N0aWMgPSB7XG4gICAgICAgIGhlbHA6IFwiUGxlYXNlIGNvbnN1bHQgdGhlIGd1aWRlcyBhdCBodHRwOi8vZ2l0aHViLmNvbS9mb28vYmFyI2d1aWRlc1wiLFxuICAgICAgfTtcblxuICAgICAgc25pcHBldHMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBjb250ZXh0OiBcImlmICh0cnVlKVwiLFxuICAgICAgICAgIGhpZ2hsaWdodDogXCJUaGlzIHdpbGwgYWx3YXlzIGJlIGNhbGxlZFwiLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBGb29CYXJCYXooKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgICBpZiAodHJ1ZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRocm93IG5ldyBTaG91bGRCZUZhbHNlRXJyb3IoXCJTaG91bGQgbWFrZSB0aGluZ3MgZHluYW1pY1wiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3Iuc3RhY2spO1xuICAgICAgICAgICAgZXhwZWN0KGVycm9yLnN0YWNrKS50b01hdGNoU25hcHNob3QoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBGb29CYXJCYXooKTtcbiAgfSk7XG59KTtcbiJdfQ==