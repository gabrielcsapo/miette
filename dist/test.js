"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const diagnostic_1 = require("./diagnostic");
const renderer_1 = require("./renderer");
// const diagnostic = new Diagnostic({
//   error: new Error("Types mismatched for operation."),
//   message: "Types mismatched for operation.",
//   source: '3 + "5"\n',
//   snippets: [
//     {
//       context: "3",
//       highlight: "int",
//     },
//     {
//       context: "+",
//       highlight: "Doesn't support these values",
//     },
//     {
//       context: '"5"',
//       highlight: "string",
//     },
//   ],
//   diagnostic: {
//     help: "Change int or string to be the right type and try again",
//     url: "http://github.com/foo/bar#guides",
//   },
// });
// const renderer = new GraphicalReportHandler(
//   diagnostic
// );
// renderer.render();
const diagnostic1 = new diagnostic_1.Diagnostic({
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
        help: "Please consult the guides",
        url: "http://github.com/foo/bar#guides",
    },
});
const renderer1 = new renderer_1.GraphicalReportHandler(diagnostic1);
renderer1.render();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQTBDO0FBQzFDLHlDQUFvRDtBQUVwRCxzQ0FBc0M7QUFDdEMseURBQXlEO0FBQ3pELGdEQUFnRDtBQUNoRCx5QkFBeUI7QUFDekIsZ0JBQWdCO0FBQ2hCLFFBQVE7QUFDUixzQkFBc0I7QUFDdEIsMEJBQTBCO0FBQzFCLFNBQVM7QUFDVCxRQUFRO0FBQ1Isc0JBQXNCO0FBQ3RCLG1EQUFtRDtBQUNuRCxTQUFTO0FBQ1QsUUFBUTtBQUNSLHdCQUF3QjtBQUN4Qiw2QkFBNkI7QUFDN0IsU0FBUztBQUNULE9BQU87QUFDUCxrQkFBa0I7QUFDbEIsdUVBQXVFO0FBQ3ZFLCtDQUErQztBQUMvQyxPQUFPO0FBQ1AsTUFBTTtBQUNOLCtDQUErQztBQUMvQyxlQUFlO0FBQ2YsS0FBSztBQUNMLHFCQUFxQjtBQUVyQixNQUFNLFdBQVcsR0FBRyxJQUFJLHVCQUFVLENBQUM7SUFDakMsS0FBSyxFQUFFLElBQUksS0FBSyxFQUFFO0lBQ2xCLE1BQU0sRUFBRSw0QkFBNEI7SUFDcEMsT0FBTyxFQUFFLDZCQUE2QjtJQUN0QyxRQUFRLEVBQUU7UUFDUjtZQUNFLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLFNBQVMsRUFBRSxzQkFBc0I7U0FDbEM7UUFDRDtZQUNFLE9BQU8sRUFBRSxNQUFNO1lBQ2YsU0FBUyxFQUFFLDBCQUEwQjtTQUN0QztLQUNGO0lBQ0QsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFLDJCQUEyQjtRQUNqQyxHQUFHLEVBQUUsa0NBQWtDO0tBQ3hDO0NBQ0YsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxTQUFTLEdBQUcsSUFBSSxpQ0FBc0IsQ0FDMUMsV0FBVyxDQUNaLENBQUM7QUFDRixTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaWFnbm9zdGljIH0gZnJvbSBcIi4vZGlhZ25vc3RpY1wiO1xuaW1wb3J0IHsgR3JhcGhpY2FsUmVwb3J0SGFuZGxlciB9IGZyb20gXCIuL3JlbmRlcmVyXCI7XG5cbi8vIGNvbnN0IGRpYWdub3N0aWMgPSBuZXcgRGlhZ25vc3RpYyh7XG4vLyAgIGVycm9yOiBuZXcgRXJyb3IoXCJUeXBlcyBtaXNtYXRjaGVkIGZvciBvcGVyYXRpb24uXCIpLFxuLy8gICBtZXNzYWdlOiBcIlR5cGVzIG1pc21hdGNoZWQgZm9yIG9wZXJhdGlvbi5cIixcbi8vICAgc291cmNlOiAnMyArIFwiNVwiXFxuJyxcbi8vICAgc25pcHBldHM6IFtcbi8vICAgICB7XG4vLyAgICAgICBjb250ZXh0OiBcIjNcIixcbi8vICAgICAgIGhpZ2hsaWdodDogXCJpbnRcIixcbi8vICAgICB9LFxuLy8gICAgIHtcbi8vICAgICAgIGNvbnRleHQ6IFwiK1wiLFxuLy8gICAgICAgaGlnaGxpZ2h0OiBcIkRvZXNuJ3Qgc3VwcG9ydCB0aGVzZSB2YWx1ZXNcIixcbi8vICAgICB9LFxuLy8gICAgIHtcbi8vICAgICAgIGNvbnRleHQ6ICdcIjVcIicsXG4vLyAgICAgICBoaWdobGlnaHQ6IFwic3RyaW5nXCIsXG4vLyAgICAgfSxcbi8vICAgXSxcbi8vICAgZGlhZ25vc3RpYzoge1xuLy8gICAgIGhlbHA6IFwiQ2hhbmdlIGludCBvciBzdHJpbmcgdG8gYmUgdGhlIHJpZ2h0IHR5cGUgYW5kIHRyeSBhZ2FpblwiLFxuLy8gICAgIHVybDogXCJodHRwOi8vZ2l0aHViLmNvbS9mb28vYmFyI2d1aWRlc1wiLFxuLy8gICB9LFxuLy8gfSk7XG4vLyBjb25zdCByZW5kZXJlciA9IG5ldyBHcmFwaGljYWxSZXBvcnRIYW5kbGVyKFxuLy8gICBkaWFnbm9zdGljXG4vLyApO1xuLy8gcmVuZGVyZXIucmVuZGVyKCk7XG5cbmNvbnN0IGRpYWdub3N0aWMxID0gbmV3IERpYWdub3N0aWMoe1xuICBlcnJvcjogbmV3IEVycm9yKCksXG4gIHNvdXJjZTogXCJzb3VyY2VcXG4gIHRleHRcXG4gICAgaGVyZVxcblwiLFxuICBtZXNzYWdlOiBcIlRoaXMgaXMgdGhlIHBhcnQgdGhhdCBicm9rZVwiLFxuICBzbmlwcGV0czogW1xuICAgIHtcbiAgICAgIGNvbnRleHQ6IFwic291cmNlXCIsXG4gICAgICBoaWdobGlnaHQ6IFwiVGhpcyBzaG91bGQgYmUgZm9vXFxuXCIsXG4gICAgfSxcbiAgICB7XG4gICAgICBjb250ZXh0OiBcInRleHRcIixcbiAgICAgIGhpZ2hsaWdodDogXCJUaGlzIHNob3VsZCBiZSBnb29kYnllXFxuXCIsXG4gICAgfSxcbiAgXSxcbiAgZGlhZ25vc3RpYzoge1xuICAgIGhlbHA6IFwiUGxlYXNlIGNvbnN1bHQgdGhlIGd1aWRlc1wiLFxuICAgIHVybDogXCJodHRwOi8vZ2l0aHViLmNvbS9mb28vYmFyI2d1aWRlc1wiLFxuICB9LFxufSk7XG5jb25zdCByZW5kZXJlcjEgPSBuZXcgR3JhcGhpY2FsUmVwb3J0SGFuZGxlcihcbiAgZGlhZ25vc3RpYzEsXG4pO1xucmVuZGVyZXIxLnJlbmRlcigpO1xuIl19