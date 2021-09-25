const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

const isDeployPreview =
  process.env.NETLIFY;

const baseUrl = process.env.BASE_URL || '/miette/';

module.exports = {
    title: "miette",
    tagline: "Fancy upgrade to Error!",
    url: "https://gabrielcsapo.github.io",
    baseUrl: baseUrl,
    trailingSlash: isDeployPreview,
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",
    favicon: "img/favicon.ico",
    organizationName: "gabrielcsapo",
    projectName: "miette",
    presets: [
      [
        "@docusaurus/preset-classic",
        {
          docs: {
            sidebarPath: require.resolve("./sidebars.js"),
            editUrl: "https://github.com/gabrielcsapo/miette/edit/main/website/",
          },
          theme: {
            customCss: require.resolve("./src/css/custom.css"),
          },
        },
    ],
  ],

  themeConfig: {
    navbar: {
      title: "Miette",
      items: [{
          type: "doc",
          docId: "intro",
          position: "left",
          label: "Documentation",
        },
        {
          href: "https://github.com/gabrielcsapo/miette",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [{
          title: "Docs",
          items: [{
            label: "Getting Started",
            to: "/docs/intro",
          }, ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Twitter",
              href: "https://twitter.com/gabrielcsapo",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/facebook/docusaurus",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Miette, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
};