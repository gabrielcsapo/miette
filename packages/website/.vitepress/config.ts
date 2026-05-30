import { defineConfig } from "vitepress"

export default defineConfig({
  title: "miette",
  description:
    "Fancy upgrade to console.log — annotated source-aware error diagnostics for TypeScript.",
  base: "/miette/",
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ["link", { rel: "icon", href: "/miette/favicon.ico" }],
    ["meta", { name: "theme-color", content: "#aa759f" }],
  ],

  themeConfig: {
    nav: [
      { text: "Docs", link: "/usage" },
      { text: "API", link: "/api" },
    ],
    sidebar: [
      {
        text: "Docs",
        items: [
          { text: "Playground", link: "/" },
          { text: "Get started", link: "/usage" },
          { text: "Declarative", link: "/declarative" },
          { text: "API reference", link: "/api" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/gabrielcsapo/miette" },
    ],
    search: { provider: "local" },
    footer: {
      message: "Released under the Apache 2.0 License.",
      copyright: "© Gabriel J. Csapo",
    },
  },

  vite: {
    ssr: {
      noExternal: ["ansi-to-html"],
    },
  },
})
