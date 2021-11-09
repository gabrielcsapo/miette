"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const diagnostic_1 = require("./diagnostic");
const renderer_1 = require("./renderer");
describe("renderer", () => {
    test("should be able to render with all required fields", () => {
        const diagnostic = new diagnostic_1.Diagnostic({
            error: new Error(),
            source: "source\n  text\n    here\n",
            message: "This is the part that broke",
            snippets: [
                {
                    context: "source",
                    highlight: "This should be foo\n",
                },
                {
                    context: "text",
                    highlight: "This should be goodbye\n",
                },
            ],
            diagnostic: {
                help: "Please consult the guides at http://github.com/foo/bar#guides",
            },
        });
        const renderer = new renderer_1.GraphicalReportHandler(diagnostic);
        renderer.render();
        expect(renderer.debugString).toMatchSnapshot();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9yZW5kZXJlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQTBDO0FBQzFDLHlDQUFvRDtBQUVwRCxRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtJQUN4QixJQUFJLENBQUMsbURBQW1ELEVBQUUsR0FBRyxFQUFFO1FBQzdELE1BQU0sVUFBVSxHQUFHLElBQUksdUJBQVUsQ0FBQztZQUNoQyxLQUFLLEVBQUUsSUFBSSxLQUFLLEVBQUU7WUFDbEIsTUFBTSxFQUFFLDRCQUE0QjtZQUNwQyxPQUFPLEVBQUUsNkJBQTZCO1lBQ3RDLFFBQVEsRUFBRTtnQkFDUjtvQkFDRSxPQUFPLEVBQUUsUUFBUTtvQkFDakIsU0FBUyxFQUFFLHNCQUFzQjtpQkFDbEM7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLE1BQU07b0JBQ2YsU0FBUyxFQUFFLDBCQUEwQjtpQkFDdEM7YUFDRjtZQUNELFVBQVUsRUFBRTtnQkFDVixJQUFJLEVBQUUsK0RBQStEO2FBQ3RFO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxRQUFRLEdBQUcsSUFBSSxpQ0FBc0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN4RCxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFbEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUNqRCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlhZ25vc3RpYyB9IGZyb20gXCIuL2RpYWdub3N0aWNcIjtcbmltcG9ydCB7IEdyYXBoaWNhbFJlcG9ydEhhbmRsZXIgfSBmcm9tIFwiLi9yZW5kZXJlclwiO1xuXG5kZXNjcmliZShcInJlbmRlcmVyXCIsICgpID0+IHtcbiAgdGVzdChcInNob3VsZCBiZSBhYmxlIHRvIHJlbmRlciB3aXRoIGFsbCByZXF1aXJlZCBmaWVsZHNcIiwgKCkgPT4ge1xuICAgIGNvbnN0IGRpYWdub3N0aWMgPSBuZXcgRGlhZ25vc3RpYyh7XG4gICAgICBlcnJvcjogbmV3IEVycm9yKCksXG4gICAgICBzb3VyY2U6IFwic291cmNlXFxuICB0ZXh0XFxuICAgIGhlcmVcXG5cIixcbiAgICAgIG1lc3NhZ2U6IFwiVGhpcyBpcyB0aGUgcGFydCB0aGF0IGJyb2tlXCIsXG4gICAgICBzbmlwcGV0czogW1xuICAgICAgICB7XG4gICAgICAgICAgY29udGV4dDogXCJzb3VyY2VcIixcbiAgICAgICAgICBoaWdobGlnaHQ6IFwiVGhpcyBzaG91bGQgYmUgZm9vXFxuXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjb250ZXh0OiBcInRleHRcIixcbiAgICAgICAgICBoaWdobGlnaHQ6IFwiVGhpcyBzaG91bGQgYmUgZ29vZGJ5ZVxcblwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGRpYWdub3N0aWM6IHtcbiAgICAgICAgaGVscDogXCJQbGVhc2UgY29uc3VsdCB0aGUgZ3VpZGVzIGF0IGh0dHA6Ly9naXRodWIuY29tL2Zvby9iYXIjZ3VpZGVzXCIsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IEdyYXBoaWNhbFJlcG9ydEhhbmRsZXIoZGlhZ25vc3RpYyk7XG4gICAgcmVuZGVyZXIucmVuZGVyKCk7XG5cbiAgICBleHBlY3QocmVuZGVyZXIuZGVidWdTdHJpbmcpLnRvTWF0Y2hTbmFwc2hvdCgpO1xuICB9KTtcbn0pO1xuIl19