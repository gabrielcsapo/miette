import DefaultTheme from "vitepress/theme"
import type { Theme } from "vitepress"
import Playground from "./Playground.vue"
import DefinePlayground from "./DefinePlayground.vue"
import "./custom.css"

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("Playground", Playground)
    app.component("DefinePlayground", DefinePlayground)
  },
} satisfies Theme
