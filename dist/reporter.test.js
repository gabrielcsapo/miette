"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.FORCE_COLOR = '0';
const diagnostic_1 = require("./diagnostic");
const reporter_1 = require("./reporter");
const theme_1 = require("./theme");
describe("reporter", () => {
    test("should be able to render ascii output (multi-line)", () => {
        const diagnostic = new diagnostic_1.Diagnostic({
            error: new Error("Types mismatched for operation."),
            source: '3 + "5"',
            snippets: [
                {
                    context: "3",
                    highlight: "int",
                },
                {
                    context: "+",
                    highlight: "Doesn't support these values",
                },
                {
                    context: '"5"',
                    highlight: "string",
                },
            ],
            diagnostic: {
                help: "Change int or string to be the right type and try again",
                url: "http://github.com/foo/bar#guides",
            },
        });
        const renderer = new reporter_1.Reporter(diagnostic, theme_1.Theme.ascii().styles, theme_1.Theme.ascii().characters);
        renderer.render();
        expect(renderer.debugString).toMatchSnapshot();
    });
    test("should be able to render unicode output (multi-line)", () => {
        const diagnostic = new diagnostic_1.Diagnostic({
            error: new Error("Types mismatched for operation."),
            source: '3 + "5"',
            snippets: [
                {
                    context: "3",
                    highlight: "int",
                },
                {
                    context: "+",
                    highlight: "Doesn't support these values",
                },
                {
                    context: '"5"',
                    highlight: "string",
                },
            ],
            diagnostic: {
                help: "Change int or string to be the right type and try again",
                url: "http://github.com/foo/bar#guides",
            },
        });
        const renderer = new reporter_1.Reporter(diagnostic, theme_1.Theme.unicode().styles, theme_1.Theme.unicode().characters);
        renderer.render();
        expect(renderer.debugString).toMatchSnapshot();
    });
    test("should be able to render ascii output (single line)", () => {
        const diagnostic = new diagnostic_1.Diagnostic({
            error: new Error(),
            source: "source\n  text\n    here",
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
                help: "Please consult the guides",
                url: "http://github.com/foo/bar#guides",
            },
        });
        const renderer = new reporter_1.Reporter(diagnostic, theme_1.Theme.ascii().styles, theme_1.Theme.ascii().characters);
        renderer.render();
        expect(renderer.debugString).toMatchSnapshot();
    });
    test("should be able to render unicode output (single line)", () => {
        const diagnostic = new diagnostic_1.Diagnostic({
            error: new Error(),
            source: "source\n  text\n    here",
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
                help: "Please consult the guides",
                url: "http://github.com/foo/bar#guides",
            },
        });
        const renderer = new reporter_1.Reporter(diagnostic, theme_1.Theme.unicode().styles, theme_1.Theme.unicode().characters);
        renderer.render();
        expect(renderer.debugString).toMatchSnapshot();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwb3J0ZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXBvcnRlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO0FBRTlCLDZDQUEwQztBQUMxQyx5Q0FBc0M7QUFDdEMsbUNBQWdDO0FBRWhDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO0lBQ3hCLElBQUksQ0FBQyxvREFBb0QsRUFBRSxHQUFHLEVBQUU7UUFDOUQsTUFBTSxVQUFVLEdBQUcsSUFBSSx1QkFBVSxDQUFDO1lBQ2hDLEtBQUssRUFBRSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQztZQUNuRCxNQUFNLEVBQUUsU0FBUztZQUNqQixRQUFRLEVBQUU7Z0JBQ1I7b0JBQ0UsT0FBTyxFQUFFLEdBQUc7b0JBQ1osU0FBUyxFQUFFLEtBQUs7aUJBQ2pCO2dCQUNEO29CQUNFLE9BQU8sRUFBRSxHQUFHO29CQUNaLFNBQVMsRUFBRSw4QkFBOEI7aUJBQzFDO2dCQUNEO29CQUNFLE9BQU8sRUFBRSxLQUFLO29CQUNkLFNBQVMsRUFBRSxRQUFRO2lCQUNwQjthQUNGO1lBQ0QsVUFBVSxFQUFFO2dCQUNWLElBQUksRUFBRSx5REFBeUQ7Z0JBQy9ELEdBQUcsRUFBRSxrQ0FBa0M7YUFDeEM7U0FDRixDQUFDLENBQUM7UUFDSCxNQUFNLFFBQVEsR0FBRyxJQUFJLG1CQUFRLENBQzNCLFVBQVUsRUFDVixhQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsTUFBTSxFQUNwQixhQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUN6QixDQUFDO1FBQ0YsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWxCLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDakQsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsc0RBQXNE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SUFDakQsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbInByb2Nlc3MuZW52LkZPUkNFX0NPTE9SID0gJzAnO1xuXG5pbXBvcnQgeyBEaWFnbm9zdGljIH0gZnJvbSBcIi4vZGlhZ25vc3RpY1wiO1xuaW1wb3J0IHsgUmVwb3J0ZXIgfSBmcm9tIFwiLi9yZXBvcnRlclwiO1xuaW1wb3J0IHsgVGhlbWUgfSBmcm9tIFwiLi90aGVtZVwiO1xuXG5kZXNjcmliZShcInJlcG9ydGVyXCIsICgpID0+IHtcbiAgdGVzdChcInNob3VsZCBiZSBhYmxlIHRvIHJlbmRlciBhc2NpaSBvdXRwdXQgKG11bHRpLWxpbmUpXCIsICgpID0+IHtcbiAgICBjb25zdCBkaWFnbm9zdGljID0gbmV3IERpYWdub3N0aWMoe1xuICAgICAgZXJyb3I6IG5ldyBFcnJvcihcIlR5cGVzIG1pc21hdGNoZWQgZm9yIG9wZXJhdGlvbi5cIiksXG4gICAgICBzb3VyY2U6ICczICsgXCI1XCInLFxuICAgICAgc25pcHBldHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGNvbnRleHQ6IFwiM1wiLFxuICAgICAgICAgIGhpZ2hsaWdodDogXCJpbnRcIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGNvbnRleHQ6IFwiK1wiLFxuICAgICAgICAgIGhpZ2hsaWdodDogXCJEb2Vzbid0IHN1cHBvcnQgdGhlc2UgdmFsdWVzXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjb250ZXh0OiAnXCI1XCInLFxuICAgICAgICAgIGhpZ2hsaWdodDogXCJzdHJpbmdcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBkaWFnbm9zdGljOiB7XG4gICAgICAgIGhlbHA6IFwiQ2hhbmdlIGludCBvciBzdHJpbmcgdG8gYmUgdGhlIHJpZ2h0IHR5cGUgYW5kIHRyeSBhZ2FpblwiLFxuICAgICAgICB1cmw6IFwiaHR0cDovL2dpdGh1Yi5jb20vZm9vL2JhciNndWlkZXNcIixcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3QgcmVuZGVyZXIgPSBuZXcgUmVwb3J0ZXIoXG4gICAgICBkaWFnbm9zdGljLFxuICAgICAgVGhlbWUuYXNjaWkoKS5zdHlsZXMsXG4gICAgICBUaGVtZS5hc2NpaSgpLmNoYXJhY3RlcnNcbiAgICApO1xuICAgIHJlbmRlcmVyLnJlbmRlcigpO1xuXG4gICAgZXhwZWN0KHJlbmRlcmVyLmRlYnVnU3RyaW5nKS50b01hdGNoU25hcHNob3QoKTtcbiAgfSk7XG5cbiAgdGVzdChcInNob3VsZCBiZSBhYmxlIHRvIHJlbmRlciB1bmljb2RlIG91dHB1dCAobXVsdGktbGluZSlcIiwgKCkgPT4ge1xuICAgIGNvbnN0IGRpYWdub3N0aWMgPSBuZXcgRGlhZ25vc3RpYyh7XG4gICAgICBlcnJvcjogbmV3IEVycm9yKFwiVHlwZXMgbWlzbWF0Y2hlZCBmb3Igb3BlcmF0aW9uLlwiKSxcbiAgICAgIHNvdXJjZTogJzMgKyBcIjVcIicsXG4gICAgICBzbmlwcGV0czogW1xuICAgICAgICB7XG4gICAgICAgICAgY29udGV4dDogXCIzXCIsXG4gICAgICAgICAgaGlnaGxpZ2h0OiBcImludFwiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgY29udGV4dDogXCIrXCIsXG4gICAgICAgICAgaGlnaGxpZ2h0OiBcIkRvZXNuJ3Qgc3VwcG9ydCB0aGVzZSB2YWx1ZXNcIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGNvbnRleHQ6ICdcIjVcIicsXG4gICAgICAgICAgaGlnaGxpZ2h0OiBcInN0cmluZ1wiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGRpYWdub3N0aWM6IHtcbiAgICAgICAgaGVscDogXCJDaGFuZ2UgaW50IG9yIHN0cmluZyB0byBiZSB0aGUgcmlnaHQgdHlwZSBhbmQgdHJ5IGFnYWluXCIsXG4gICAgICAgIHVybDogXCJodHRwOi8vZ2l0aHViLmNvbS9mb28vYmFyI2d1aWRlc1wiLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCByZW5kZXJlciA9IG5ldyBSZXBvcnRlcihcbiAgICAgIGRpYWdub3N0aWMsXG4gICAgICBUaGVtZS51bmljb2RlKCkuc3R5bGVzLFxuICAgICAgVGhlbWUudW5pY29kZSgpLmNoYXJhY3RlcnNcbiAgICApO1xuICAgIHJlbmRlcmVyLnJlbmRlcigpO1xuXG4gICAgZXhwZWN0KHJlbmRlcmVyLmRlYnVnU3RyaW5nKS50b01hdGNoU25hcHNob3QoKTtcbiAgfSk7XG5cbiAgdGVzdChcInNob3VsZCBiZSBhYmxlIHRvIHJlbmRlciBhc2NpaSBvdXRwdXQgKHNpbmdsZSBsaW5lKVwiLCAoKSA9PiB7XG4gICAgY29uc3QgZGlhZ25vc3RpYyA9IG5ldyBEaWFnbm9zdGljKHtcbiAgICAgIGVycm9yOiBuZXcgRXJyb3IoKSxcbiAgICAgIHNvdXJjZTogXCJzb3VyY2VcXG4gIHRleHRcXG4gICAgaGVyZVwiLFxuICAgICAgbWVzc2FnZTogXCJUaGlzIGlzIHRoZSBwYXJ0IHRoYXQgYnJva2VcIixcbiAgICAgIHNuaXBwZXRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjb250ZXh0OiBcInNvdXJjZVwiLFxuICAgICAgICAgIGhpZ2hsaWdodDogXCJUaGlzIHNob3VsZCBiZSBmb29cXG5cIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGNvbnRleHQ6IFwidGV4dFwiLFxuICAgICAgICAgIGhpZ2hsaWdodDogXCJUaGlzIHNob3VsZCBiZSBnb29kYnllXFxuXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgZGlhZ25vc3RpYzoge1xuICAgICAgICBoZWxwOiBcIlBsZWFzZSBjb25zdWx0IHRoZSBndWlkZXNcIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9naXRodWIuY29tL2Zvby9iYXIjZ3VpZGVzXCIsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IFJlcG9ydGVyKFxuICAgICAgZGlhZ25vc3RpYyxcbiAgICAgIFRoZW1lLmFzY2lpKCkuc3R5bGVzLFxuICAgICAgVGhlbWUuYXNjaWkoKS5jaGFyYWN0ZXJzXG4gICAgKTtcbiAgICByZW5kZXJlci5yZW5kZXIoKTtcblxuICAgIGV4cGVjdChyZW5kZXJlci5kZWJ1Z1N0cmluZykudG9NYXRjaFNuYXBzaG90KCk7XG4gIH0pO1xuXG4gIHRlc3QoXCJzaG91bGQgYmUgYWJsZSB0byByZW5kZXIgdW5pY29kZSBvdXRwdXQgKHNpbmdsZSBsaW5lKVwiLCAoKSA9PiB7XG4gICAgY29uc3QgZGlhZ25vc3RpYyA9IG5ldyBEaWFnbm9zdGljKHtcbiAgICAgIGVycm9yOiBuZXcgRXJyb3IoKSxcbiAgICAgIHNvdXJjZTogXCJzb3VyY2VcXG4gIHRleHRcXG4gICAgaGVyZVwiLFxuICAgICAgbWVzc2FnZTogXCJUaGlzIGlzIHRoZSBwYXJ0IHRoYXQgYnJva2VcIixcbiAgICAgIHNuaXBwZXRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjb250ZXh0OiBcInNvdXJjZVwiLFxuICAgICAgICAgIGhpZ2hsaWdodDogXCJUaGlzIHNob3VsZCBiZSBmb29cXG5cIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGNvbnRleHQ6IFwidGV4dFwiLFxuICAgICAgICAgIGhpZ2hsaWdodDogXCJUaGlzIHNob3VsZCBiZSBnb29kYnllXFxuXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgZGlhZ25vc3RpYzoge1xuICAgICAgICBoZWxwOiBcIlBsZWFzZSBjb25zdWx0IHRoZSBndWlkZXNcIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9naXRodWIuY29tL2Zvby9iYXIjZ3VpZGVzXCIsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IFJlcG9ydGVyKFxuICAgICAgZGlhZ25vc3RpYyxcbiAgICAgIFRoZW1lLnVuaWNvZGUoKS5zdHlsZXMsXG4gICAgICBUaGVtZS51bmljb2RlKCkuY2hhcmFjdGVyc1xuICAgICk7XG4gICAgcmVuZGVyZXIucmVuZGVyKCk7XG5cbiAgICBleHBlY3QocmVuZGVyZXIuZGVidWdTdHJpbmcpLnRvTWF0Y2hTbmFwc2hvdCgpO1xuICB9KTtcbn0pO1xuIl19