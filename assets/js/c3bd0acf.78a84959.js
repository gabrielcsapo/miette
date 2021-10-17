"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9809],{3905:function(e,t,r){r.d(t,{Zo:function(){return m},kt:function(){return d}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var c=n.createContext({}),p=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},m=function(e){var t=p(e.components);return n.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},s=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,c=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),s=p(r),d=a,f=s["".concat(c,".").concat(d)]||s[d]||u[d]||i;return r?n.createElement(f,o(o({ref:t},m),{},{components:r})):n.createElement(f,o({ref:t},m))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,o=new Array(i);o[0]=s;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var p=2;p<i;p++)o[p]=r[p];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}s.displayName="MDXCreateElement"},6935:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return l},contentTitle:function(){return c},metadata:function(){return p},toc:function(){return m},default:function(){return s}});var n=r(7462),a=r(3366),i=(r(7294),r(3905)),o=["components"],l={},c=void 0,p={unversionedId:"api/miette.miette",id:"api/miette.miette",isDocsHomePage:!1,title:"miette.miette",description:"Home &gt; miette &gt; miette",source:"@site/docs/api/miette.miette.md",sourceDirName:"api",slug:"/api/miette.miette",permalink:"/miette/docs/api/miette.miette",editUrl:"https://github.com/gabrielcsapo/miette/edit/main/website/docs/api/miette.miette.md",tags:[],version:"current",frontMatter:{},sidebar:"defaultSidebar",previous:{title:"miette",permalink:"/miette/docs/api/miette"},next:{title:"miette.mietteerror",permalink:"/miette/docs/api/miette.mietteerror"}},m=[{value:"miette() function",id:"miette-function",children:[],level:2},{value:"Parameters",id:"parameters",children:[],level:2},{value:"Example",id:"example",children:[],level:2}],u={toc:m};function s(e){var t=e.components,r=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"/miette/docs/"},"Home")," ",">"," ",(0,i.kt)("a",{parentName:"p",href:"/miette/docs/api/miette"},"miette")," ",">"," ",(0,i.kt)("a",{parentName:"p",href:"/miette/docs/api/miette.miette"},"miette")),(0,i.kt)("h2",{id:"miette-function"},"miette() function"),(0,i.kt)("p",null,"Miette Decorator function to be used on Error"),(0,i.kt)("b",null,"Signature:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"export declare function miette(code: string, source: string): <T extends new (...args: any[]) => {}>(constructor: T) => {\n    new (...args: any[]): {\n        stackHolder: void;\n        name: string;\n        stack: string;\n    };\n} & T;\n")),(0,i.kt)("h2",{id:"parameters"},"Parameters"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},"Parameter"),(0,i.kt)("th",{parentName:"tr",align:null},"Type"),(0,i.kt)("th",{parentName:"tr",align:null},"Description"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"code"),(0,i.kt)("td",{parentName:"tr",align:null},"string"),(0,i.kt)("td",{parentName:"tr",align:null},"error code")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"source"),(0,i.kt)("td",{parentName:"tr",align:null},"string"),(0,i.kt)("td",{parentName:"tr",align:null},"raw source that miette needs to annotate")))),(0,i.kt)("b",null,"Returns:"),(0,i.kt)("p",null,"<","T extends new (...args: any","[","]",") =",">"," {}",">","(constructor: T) =",">"," { new (...args: any","[","]","): { stackHolder: void; name: string; stack: string; }; } ","&"," T"),(0,i.kt)("h2",{id:"example"},"Example"),(0,i.kt)("p",null,"`","`","`"," @",'miette( "foo::bar::baz", prettier.format(FooBarBaz.toString(), { parser: "babel" }',') ) class ShouldBeFalseError extends Error { diagnostic = { help: "Please consult the guides at ',(0,i.kt)("a",{parentName:"p",href:"http://github.com/foo/bar%5C#guides%22"},'http://github.com/foo/bar\\#guides"'),", }",";"),(0,i.kt)("p",null,"snippets = ","[",' { context: "if (true)", highlight: "This will always be called", }',", ","]","; } ","`","`","`"))}s.isMDXComponent=!0}}]);