<script setup lang="ts">
import {
  computed,
  onMounted,
  onBeforeUnmount,
  ref,
  shallowRef,
  watch,
} from "vue"
import type { DecorationSet, EditorView } from "@codemirror/view"
import {
  asciiCharacters,
  bold,
  compose,
  formatDiagnostic,
  rgb,
  underline,
  unicodeCharacters,
  type Painter,
  type Snippet,
  type Theme,
} from "miette"
import { presets, type PlaygroundPreset } from "./presets"

type CharacterSet = "unicode" | "ascii"

interface RgbColor {
  r: number
  g: number
  b: number
}

const DEFAULT_STYLE_COLORS: Record<
  "error" | "warning" | "advice" | "code" | "help" | "filename",
  RgbColor
> = {
  error: { r: 172, g: 65, b: 66 },
  warning: { r: 244, g: 191, b: 117 },
  advice: { r: 106, g: 159, b: 181 },
  code: { r: 170, g: 117, b: 159 },
  help: { r: 106, g: 159, b: 181 },
  filename: { r: 117, g: 181, b: 170 },
}

const DEFAULT_HIGHLIGHTS: RgbColor[] = [
  { r: 255, g: 135, b: 162 },
  { r: 150, g: 232, b: 133 },
  { r: 62, g: 238, b: 210 },
  { r: 234, g: 207, b: 182 },
  { r: 130, g: 221, b: 255 },
  { r: 255, g: 188, b: 242 },
]

function toHex({ r, g, b }: RgbColor): string {
  const h = (n: number) => n.toString(16).padStart(2, "0")
  return `#${h(r)}${h(g)}${h(b)}`
}

function fromHex(hex: string): RgbColor {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return { r: 0, g: 0, b: 0 }
  const n = parseInt(m[1], 16)
  return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff }
}

function toCss({ r, g, b }: RgbColor): string {
  return `rgb(${r}, ${g}, ${b})`
}

interface EditableSnippet {
  id: number
  start: number
  end: number
  label: string
}

function snippetColor(index: number): string {
  return toCss(highlightColors.value[index % highlightColors.value.length])
}

let nextId = 1
function snippetsFromPreset(preset: PlaygroundPreset): EditableSnippet[] {
  return preset.snippets.map((s) => ({ id: nextId++, ...s }))
}

const initialPreset = presets[0]
const source = ref(initialPreset.source)
const message = ref(initialPreset.message)
const help = ref(initialPreset.help)
const errorCode = ref(initialPreset.code)
const snippets = ref<EditableSnippet[]>(snippetsFromPreset(initialPreset))
const activePresetId = ref<string>(initialPreset.id)
const metadataOpen = ref(false)
const themeOpen = ref(false)

const characterSet = ref<CharacterSet>("unicode")
const styleColors = ref({ ...DEFAULT_STYLE_COLORS })
const highlightColors = ref<RgbColor[]>(
  DEFAULT_HIGHLIGHTS.map((c) => ({ ...c })),
)

const STYLE_KEYS = [
  "error",
  "warning",
  "advice",
  "code",
  "help",
  "filename",
] as const
type StyleKey = (typeof STYLE_KEYS)[number]

function styleColor(key: StyleKey): string {
  return toHex(styleColors.value[key])
}

function setStyleColor(key: StyleKey, hex: string) {
  styleColors.value = { ...styleColors.value, [key]: fromHex(hex) }
}

function highlightColorHex(idx: number): string {
  return toHex(highlightColors.value[idx])
}

function setHighlightColor(idx: number, hex: string) {
  const next = highlightColors.value.slice()
  next[idx] = fromHex(hex)
  highlightColors.value = next
}

function resetTheme() {
  characterSet.value = "unicode"
  styleColors.value = { ...DEFAULT_STYLE_COLORS }
  highlightColors.value = DEFAULT_HIGHLIGHTS.map((c) => ({ ...c }))
}

const theme = computed<Theme>(() => {
  const paint = (c: RgbColor): Painter => rgb(c.r, c.g, c.b)
  const sc = styleColors.value
  return {
    characters:
      characterSet.value === "ascii" ? asciiCharacters : unicodeCharacters,
    styles: {
      error: paint(sc.error),
      warning: paint(sc.warning),
      advice: paint(sc.advice),
      code: paint(sc.code),
      help: paint(sc.help),
      filename: compose(paint(sc.filename), underline, bold),
      highlights: highlightColors.value.map(paint),
    },
  }
})

const editorEl = ref<HTMLDivElement | null>(null)
const selectionRange = ref<{ from: number; to: number } | null>(null)
const cmView = shallowRef<unknown>(null)
const ansiConverter = shallowRef<{ toHtml: (s: string) => string } | null>(null)

function loadPreset(preset: PlaygroundPreset) {
  source.value = preset.source
  message.value = preset.message
  help.value = preset.help
  errorCode.value = preset.code
  snippets.value = snippetsFromPreset(preset)
  activePresetId.value = preset.id
  const view = cmView.value as {
    state: { doc: { length: number } }
    dispatch: (tx: object) => void
  } | null
  if (view) {
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: preset.source },
    })
  }
}

const rawOutput = computed(() => {
  const error = new Error(message.value)
  return formatDiagnostic({
    error,
    source: source.value,
    message: message.value,
    snippets: snippets.value
      .filter((s) => s.end > s.start)
      .map<Snippet>((s) => ({
        span: [s.start, s.end],
        label: s.label || undefined,
      })),
    diagnostic: {
      code: errorCode.value || undefined,
      help: help.value || undefined,
    },
    theme: theme.value,
  })
})

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

const renderedHtml = computed(() => {
  const conv = ansiConverter.value
  if (!conv) return escapeHtml(rawOutput.value)
  return conv.toHtml(escapeHtml(rawOutput.value))
})

function addSnippetFromSelection() {
  const sel = selectionRange.value
  if (!sel || sel.to <= sel.from) return
  snippets.value.push({
    id: nextId++,
    start: sel.from,
    end: sel.to,
    label: "label",
  })
}

function removeSnippet(id: number) {
  snippets.value = snippets.value.filter((s) => s.id !== id)
}

function onPresetChange(e: Event) {
  const id = (e.target as HTMLSelectElement).value
  const preset = presets.find((p) => p.id === id)
  if (preset) loadPreset(preset)
}

const activePreset = computed(
  () => presets.find((p) => p.id === activePresetId.value) ?? presets[0],
)

type ShikiLang = "typescript" | "rust" | "json"

function langOf(presetId: string): ShikiLang {
  switch (presetId) {
    case "rust-borrow":
      return "rust"
    case "json-trailing-comma":
      return "json"
    default:
      return "typescript"
  }
}

const sourceFilename = computed(() => {
  switch (activePresetId.value) {
    case "ts-type-error":
      return "playground.ts"
    case "type-mismatch":
      return "expr.ts"
    case "rust-borrow":
      return "main.rs"
    case "json-trailing-comma":
      return "package.json"
    case "custom":
      return "scratch.ts"
    default:
      return "playground.ts"
  }
})

const hasSelection = computed(
  () =>
    !!selectionRange.value &&
    selectionRange.value.to > selectionRange.value.from,
)

type ShikiToken = {
  content: string
  color?: string
  fontStyle?: number
}
type ShikiHighlighter = {
  codeToTokensBase: (
    code: string,
    opts: { lang: ShikiLang; theme: string },
  ) => ShikiToken[][]
}

const activeLang = ref<ShikiLang>(langOf(initialPreset.id))
const isDark = ref(true)
const shikiTheme = computed(() =>
  isDark.value ? "github-dark" : "github-light",
)

let darkObserver: MutationObserver | null = null

watch(activePresetId, (id) => {
  activeLang.value = langOf(id)
})

onMounted(async () => {
  const [
    { EditorState, Compartment, RangeSetBuilder, StateEffect, StateField },
    { Decoration, EditorView, keymap, lineNumbers, highlightActiveLine },
    { defaultKeymap, history, historyKeymap },
    ansiMod,
    shikiMod,
  ] = await Promise.all([
    import("@codemirror/state"),
    import("@codemirror/view"),
    import("@codemirror/commands"),
    import("ansi-to-html"),
    import("shiki"),
  ])

  const AnsiUp = (ansiMod.default ?? ansiMod) as new (opts?: {
    fg?: string
    bg?: string
    newline?: boolean
    escapeXML?: boolean
  }) => { toHtml: (s: string) => string }
  ansiConverter.value = new AnsiUp({
    newline: true,
    escapeXML: false,
  })

  const highlighter = (await shikiMod.createHighlighter({
    themes: ["github-dark", "github-light"],
    langs: ["typescript", "rust", "json"],
  })) as unknown as ShikiHighlighter

  const setShikiDecorations = StateEffect.define<DecorationSet>()
  const shikiField = StateField.define<DecorationSet>({
    create: () => Decoration.none,
    update(deco, tr) {
      let next = deco.map(tr.changes)
      for (const e of tr.effects) {
        if (e.is(setShikiDecorations)) next = e.value
      }
      return next
    },
    provide: (f) => EditorView.decorations.from(f),
  })

  function buildDecorations(code: string, lang: ShikiLang) {
    const lines = highlighter.codeToTokensBase(code, {
      lang,
      theme: shikiTheme.value,
    })
    const builder = new RangeSetBuilder<Decoration>()
    let pos = 0
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      for (const tok of line) {
        const len = tok.content.length
        if (len > 0 && (tok.color || tok.fontStyle)) {
          const styles: string[] = []
          if (tok.color) styles.push(`color:${tok.color}`)
          if (tok.fontStyle) {
            if (tok.fontStyle & 1) styles.push("font-style:italic")
            if (tok.fontStyle & 2) styles.push("font-weight:600")
            if (tok.fontStyle & 4) styles.push("text-decoration:underline")
          }
          builder.add(
            pos,
            pos + len,
            Decoration.mark({ attributes: { style: styles.join(";") } }),
          )
        }
        pos += len
      }
      // CodeMirror doc uses '\n' as line separators; account for it between lines.
      if (i < lines.length - 1) pos += 1
    }
    return builder.finish()
  }

  function pushHighlights(v: EditorView, code: string, lang: ShikiLang) {
    v.dispatch({
      effects: setShikiDecorations.of(buildDecorations(code, lang)),
    })
  }

  const editable = new Compartment()
  const view = new EditorView({
    state: EditorState.create({
      doc: source.value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        history(),
        shikiField,
        keymap.of([...defaultKeymap, ...historyKeymap]),
        editable.of(EditorView.editable.of(true)),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) {
            source.value = u.state.doc.toString()
            pushHighlights(u.view, u.state.doc.toString(), activeLang.value)
          }
          if (u.selectionSet) {
            const r = u.state.selection.main
            selectionRange.value = { from: r.from, to: r.to }
          }
        }),
        EditorView.theme({
          "&": {
            height: "100%",
            fontSize: "13px",
            backgroundColor: "transparent",
          },
          ".cm-scroller": { fontFamily: "var(--vp-font-family-mono)" },
          ".cm-content": { padding: "10px 0" },
          ".cm-gutters": {
            backgroundColor: "transparent",
            borderRight: "1px solid var(--miette-term-border)",
            color: "var(--miette-term-fg-subtle)",
          },
          ".cm-activeLine": {
            backgroundColor: "var(--miette-term-active-line)",
          },
          ".cm-activeLineGutter": {
            backgroundColor: "transparent",
            color: "var(--miette-term-fg-secondary)",
          },
          ".cm-cursor": { borderLeftColor: "var(--miette-term-cursor)" },
          "&.cm-focused": { outline: "none" },
          ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
            backgroundColor: "var(--miette-term-selection) !important",
          },
        }),
      ],
    }),
    parent: editorEl.value!,
  })
  cmView.value = view

  const root = document.documentElement
  isDark.value = root.classList.contains("dark")
  darkObserver = new MutationObserver(() => {
    isDark.value = root.classList.contains("dark")
  })
  darkObserver.observe(root, { attributes: true, attributeFilter: ["class"] })

  pushHighlights(view, source.value, activeLang.value)

  watch(activeLang, (lang) => {
    pushHighlights(view, view.state.doc.toString(), lang)
  })
  watch(shikiTheme, () => {
    pushHighlights(view, view.state.doc.toString(), activeLang.value)
  })
})

onBeforeUnmount(() => {
  const v = cmView.value as { destroy?: () => void } | null
  v?.destroy?.()
  darkObserver?.disconnect()
})

watch(activePreset, () => {
  // ensure the editor doc stays in sync if loadPreset ran before mount
  const view = cmView.value as {
    state: { doc: { toString: () => string; length: number } }
    dispatch: (tx: object) => void
  } | null
  if (view && view.state.doc.toString() !== source.value) {
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: source.value },
    })
  }
})
</script>

<template>
  <div class="miette-pg">
    <div class="miette-pg-toolbar">
      <label class="miette-pg-preset">
        <span class="miette-pg-preset-label">Example</span>
        <select :value="activePresetId" @change="onPresetChange">
          <option v-for="p in presets" :key="p.id" :value="p.id">
            {{ p.label }}
          </option>
        </select>
      </label>
      <span class="miette-pg-preset-desc">{{ activePreset.description }}</span>
    </div>

    <div class="miette-pg-grid">
      <section class="miette-pg-pane miette-pg-source-pane">
        <header class="miette-pg-pane-chrome">
          <span class="miette-pg-dot miette-pg-dot-red" />
          <span class="miette-pg-dot miette-pg-dot-yellow" />
          <span class="miette-pg-dot miette-pg-dot-green" />
          <div class="miette-pg-tabs">
            <div class="miette-pg-tab miette-pg-tab-active">
              <svg
                class="miette-pg-tab-icon"
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M9.5 1.5H4a1.5 1.5 0 0 0-1.5 1.5v10A1.5 1.5 0 0 0 4 14.5h8a1.5 1.5 0 0 0 1.5-1.5V5.5L9.5 1.5z"
                  stroke="currentColor"
                  stroke-width="1.1"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.5 1.5V5.5h4"
                  stroke="currentColor"
                  stroke-width="1.1"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="miette-pg-tab-name">{{ sourceFilename }}</span>
            </div>
          </div>
          <button
            v-if="hasSelection"
            class="miette-pg-add"
            @click="addSnippetFromSelection"
            title="Attach a snippet to the selected text"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M8 3.5v9M3.5 8h9"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
              />
            </svg>
            <span>snippet</span>
          </button>
        </header>

        <div ref="editorEl" class="miette-pg-editor" />

        <div class="miette-pg-snippets">
          <div class="miette-pg-snippets-header">
            <span class="miette-pg-snippets-count">
              <span class="miette-pg-count-num">{{ snippets.length }}</span>
              snippet{{ snippets.length === 1 ? "" : "s" }}
            </span>
            <span class="miette-pg-hint" v-if="snippets.length === 0">
              Drag-select in the editor, then press
              <kbd class="miette-pg-kbd">+ snippet</kbd>
            </span>
          </div>
          <ul v-if="snippets.length > 0" class="miette-pg-snippet-list">
            <li
              v-for="(s, idx) in snippets"
              :key="s.id"
              class="miette-pg-snippet"
              :style="{ '--snippet-color': snippetColor(idx) }"
            >
              <span class="miette-pg-snippet-bar" aria-hidden="true" />
              <code class="miette-pg-span"
                >{{ s.start }}<span class="miette-pg-span-dash">-</span
                >{{ s.end }}</code
              >
              <input
                v-model="s.label"
                type="text"
                class="miette-pg-label-input"
                placeholder="label"
                spellcheck="false"
              />
              <button
                class="miette-pg-remove"
                @click="removeSnippet(s.id)"
                :title="`remove snippet ${s.start}-${s.end}`"
                aria-label="remove snippet"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 4l8 8M12 4l-8 8"
                    stroke="currentColor"
                    stroke-width="1.4"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </div>

        <div class="miette-pg-meta">
          <button
            type="button"
            class="miette-pg-meta-toggle"
            :class="{ 'is-open': metadataOpen }"
            :aria-expanded="metadataOpen"
            @click="metadataOpen = !metadataOpen"
          >
            <svg
              class="miette-pg-chevron"
              width="10"
              height="10"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 3l5 5-5 5"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>diagnostic metadata</span>
          </button>
          <div v-if="metadataOpen" class="miette-pg-meta-grid">
            <label class="miette-pg-meta-row">
              <span class="miette-pg-meta-key">message</span>
              <input
                v-model="message"
                type="text"
                class="miette-pg-meta-input"
              />
            </label>
            <label class="miette-pg-meta-row">
              <span class="miette-pg-meta-key">code</span>
              <input
                v-model="errorCode"
                type="text"
                class="miette-pg-meta-input"
              />
            </label>
            <label class="miette-pg-meta-row">
              <span class="miette-pg-meta-key">help</span>
              <input v-model="help" type="text" class="miette-pg-meta-input" />
            </label>
          </div>
        </div>
      </section>

      <section class="miette-pg-pane miette-pg-terminal">
        <header class="miette-pg-term-bar">
          <span class="miette-pg-dot miette-pg-dot-red" />
          <span class="miette-pg-dot miette-pg-dot-yellow" />
          <span class="miette-pg-dot miette-pg-dot-green" />
          <span class="miette-pg-term-title"
            >~/projects/miette — formatDiagnostic()</span
          >
        </header>
        <pre class="miette-pg-term-body" v-html="renderedHtml" />

        <div class="miette-pg-meta">
          <div class="miette-pg-theme-header">
            <button
              type="button"
              class="miette-pg-meta-toggle"
              :class="{ 'is-open': themeOpen }"
              :aria-expanded="themeOpen"
              @click="themeOpen = !themeOpen"
            >
              <svg
                class="miette-pg-chevron"
                width="10"
                height="10"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 3l5 5-5 5"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>theme</span>
            </button>
            <button
              v-if="themeOpen"
              type="button"
              class="miette-pg-theme-reset"
              @click="resetTheme"
              title="Restore the default theme"
            >
              reset
            </button>
          </div>
          <div v-if="themeOpen" class="miette-pg-theme-body">
            <div class="miette-pg-theme-row miette-pg-theme-charset">
              <span class="miette-pg-meta-key">chars</span>
              <div
                class="miette-pg-segmented"
                role="radiogroup"
                aria-label="character set"
              >
                <button
                  type="button"
                  role="radio"
                  :aria-checked="characterSet === 'unicode'"
                  :class="{ 'is-active': characterSet === 'unicode' }"
                  @click="characterSet = 'unicode'"
                >
                  unicode
                </button>
                <button
                  type="button"
                  role="radio"
                  :aria-checked="characterSet === 'ascii'"
                  :class="{ 'is-active': characterSet === 'ascii' }"
                  @click="characterSet = 'ascii'"
                >
                  ascii
                </button>
              </div>
            </div>

            <div class="miette-pg-theme-group">
              <span class="miette-pg-theme-group-label">styles</span>
              <div class="miette-pg-swatches">
                <label
                  v-for="key in STYLE_KEYS"
                  :key="key"
                  class="miette-pg-swatch"
                >
                  <input
                    type="color"
                    :value="styleColor(key)"
                    @input="
                      setStyleColor(
                        key,
                        ($event.target as HTMLInputElement).value,
                      )
                    "
                  />
                  <span class="miette-pg-swatch-name">{{ key }}</span>
                </label>
              </div>
            </div>

            <div class="miette-pg-theme-group">
              <span class="miette-pg-theme-group-label">highlights</span>
              <div class="miette-pg-swatches">
                <label
                  v-for="(_, idx) in highlightColors"
                  :key="idx"
                  class="miette-pg-swatch"
                >
                  <input
                    type="color"
                    :value="highlightColorHex(idx)"
                    @input="
                      setHighlightColor(
                        idx,
                        ($event.target as HTMLInputElement).value,
                      )
                    "
                  />
                  <span class="miette-pg-swatch-name">#{{ idx + 1 }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.miette-pg {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px 32px;
  box-sizing: border-box;
}

.miette-pg-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 12px 0 20px;
}

.miette-pg-preset {
  display: flex;
  align-items: center;
  gap: 8px;
}

.miette-pg-preset-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--vp-c-text-2);
}

.miette-pg-preset select {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  padding: 7px 32px 7px 12px;
  font-size: 13px;
  font-family: var(--vp-font-family-base);
  color: var(--vp-c-text-1);
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'><polyline points='6 9 12 15 18 9'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 12px;
  font-weight: 500;
  transition:
    border-color 0.15s,
    background-color 0.15s;
}

.miette-pg-preset select:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-alt);
}

.miette-pg-preset select:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(120, 113, 198, 0.15);
}

.miette-pg-preset-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  font-style: italic;
}

.miette-pg-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  gap: 20px;
  align-items: start;
}

@media (max-width: 960px) {
  .miette-pg-grid {
    grid-template-columns: 1fr;
  }
}

/* Shared pane shape — both source and terminal use this so the two read as
   halves of the same designed object. */
.miette-pg-pane {
  border: 1px solid var(--miette-term-border);
  border-radius: 10px;
  background: var(--miette-term-bg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.2),
    0 10px 40px -10px rgba(0, 0, 0, 0.4);
}

/* ---------- Source pane ---------- */

.miette-pg-source-pane {
  color: var(--miette-term-fg-secondary);
}

.miette-pg-pane-chrome {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px 0 14px;
  background: var(--miette-term-chrome);
  border-bottom: 1px solid var(--miette-term-border);
  min-height: 38px;
}

.miette-pg-tabs {
  flex: 1;
  display: flex;
  align-items: flex-end;
  align-self: stretch;
  margin: 0 4px;
  padding-top: 4px;
  overflow: hidden;
}

.miette-pg-tab {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 30px;
  padding: 0 14px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--miette-term-fg-secondary);
  background: var(--miette-term-bg);
  border: 1px solid var(--miette-term-border);
  border-bottom-color: var(--miette-term-bg);
  border-radius: 6px 6px 0 0;
  position: relative;
  top: 1px;
  letter-spacing: 0.01em;
}

.miette-pg-tab-icon {
  color: var(--miette-term-fg-muted);
  flex-shrink: 0;
}

.miette-pg-tab-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.miette-pg-add {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 10px 0 8px;
  font-size: 12px;
  font-weight: 500;
  font-family: var(--vp-font-family-base);
  color: var(--miette-term-accent);
  background: var(--miette-term-accent-soft);
  border: 1px solid var(--miette-term-accent-strong);
  border-radius: 6px;
  cursor: pointer;
  transition:
    color 0.15s,
    border-color 0.15s,
    background-color 0.15s;
  flex-shrink: 0;
  animation: miette-pg-add-in 0.15s ease-out;
}

.miette-pg-add:hover {
  color: #fff;
  border-color: rgba(120, 113, 198, 0.95);
  background: rgba(120, 113, 198, 0.22);
}

@keyframes miette-pg-add-in {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* Editor body — let CodeMirror fill, blend with pane bg, give breathing room */
.miette-pg-editor {
  min-height: 220px;
  max-height: 320px;
  overflow: auto;
  background: var(--miette-term-bg);
}

.miette-pg-editor :deep(.cm-editor) {
  height: 100%;
  background: transparent;
}

.miette-pg-editor :deep(.cm-gutters) {
  background-color: transparent !important;
}

/* ---------- Snippet list ---------- */

.miette-pg-snippets {
  padding: 12px 14px 14px;
  border-top: 1px solid var(--miette-term-border);
  background: var(--miette-term-chrome);
}

.miette-pg-snippets-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 11px;
  color: var(--miette-term-fg-muted);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}

.miette-pg-snippets-count {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
}

.miette-pg-count-num {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--miette-term-fg);
  font-weight: 700;
  letter-spacing: 0;
}

.miette-pg-hint {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 400;
  font-size: 11px;
  color: var(--miette-term-fg-muted);
}

.miette-pg-kbd {
  font-family: var(--vp-font-family-mono);
  font-size: 10.5px;
  background: var(--miette-term-bg);
  border: 1px solid var(--miette-term-border);
  border-radius: 3px;
  padding: 1px 5px;
  color: var(--miette-term-fg-secondary);
}

.miette-pg-snippet-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

/* Each snippet is a chip-row with a color rail on the left matching
   the highlight color it gets in the terminal pane. */
.miette-pg-snippet {
  display: grid;
  grid-template-columns: 4px auto 1fr auto;
  align-items: stretch;
  gap: 0;
  background: var(--miette-term-bg);
  border: 1px solid var(--miette-term-border);
  border-radius: 6px;
  overflow: hidden;
  transition:
    border-color 0.15s,
    background-color 0.15s;
}

.miette-pg-snippet:hover,
.miette-pg-snippet:focus-within {
  border-color: color-mix(
    in srgb,
    var(--snippet-color) 50%,
    var(--miette-term-border)
  );
}

.miette-pg-snippet-bar {
  background: var(--snippet-color);
  width: 4px;
}

.miette-pg-span {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  color: var(--snippet-color);
  background: transparent;
  padding: 0 10px 0 10px;
  display: inline-flex;
  align-items: center;
  letter-spacing: 0.02em;
  white-space: nowrap;
  border-right: 1px solid var(--miette-term-border);
  font-variant-numeric: tabular-nums;
}

.miette-pg-span-dash {
  opacity: 0.6;
  margin: 0 1px;
}

.miette-pg-label-input {
  border: none;
  outline: none;
  background: transparent;
  padding: 7px 10px;
  font-size: 12.5px;
  font-family: var(--vp-font-family-mono);
  color: var(--miette-term-fg);
  min-width: 0;
  width: 100%;
}

.miette-pg-label-input::placeholder {
  color: var(--miette-term-fg-subtle);
  font-style: italic;
}

.miette-pg-label-input:focus {
  background: rgba(120, 113, 198, 0.08);
}

.miette-pg-remove {
  background: transparent;
  border: none;
  border-left: 1px solid var(--miette-term-border);
  color: var(--miette-term-fg-subtle);
  cursor: pointer;
  width: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    color 0.15s,
    background-color 0.15s;
}

.miette-pg-remove:hover {
  color: var(--miette-term-danger);
  background: var(--miette-term-danger-soft);
}

/* ---------- Metadata disclosure ---------- */

.miette-pg-meta {
  border-top: 1px solid var(--miette-term-border);
  background: var(--miette-term-chrome);
}

.miette-pg-meta-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 14px;
  background: transparent;
  border: none;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--miette-term-fg-muted);
  cursor: pointer;
  font-family: var(--vp-font-family-base);
  text-align: left;
  transition: color 0.15s;
}

.miette-pg-meta-toggle:hover {
  color: var(--miette-term-fg);
}

.miette-pg-chevron {
  color: var(--miette-term-fg-subtle);
  transition:
    transform 0.15s ease,
    color 0.15s;
  flex-shrink: 0;
}

.miette-pg-meta-toggle:hover .miette-pg-chevron {
  color: var(--miette-term-fg-secondary);
}

.miette-pg-meta-toggle.is-open .miette-pg-chevron {
  transform: rotate(90deg);
}

.miette-pg-meta-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 14px 14px;
}

.miette-pg-meta-row {
  display: grid;
  grid-template-columns: 70px 1fr;
  align-items: center;
  gap: 10px;
}

.miette-pg-meta-key {
  font-size: 10.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--miette-term-fg-subtle);
  font-family: var(--vp-font-family-mono);
}

.miette-pg-meta-input {
  border: 1px solid var(--miette-term-border);
  background: var(--miette-term-bg);
  border-radius: 5px;
  padding: 6px 10px;
  font-size: 12.5px;
  font-family: var(--vp-font-family-mono);
  color: var(--miette-term-fg);
  outline: none;
  transition:
    border-color 0.15s,
    background-color 0.15s;
}

.miette-pg-meta-input:focus {
  border-color: var(--miette-term-accent-strong);
  background: rgba(120, 113, 198, 0.06);
}

/* ---------- Terminal pane (unchanged behavior, shared shape) ---------- */

.miette-pg-term-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--miette-term-chrome);
  border-bottom: 1px solid var(--miette-term-border);
  position: relative;
  min-height: 38px;
  box-sizing: border-box;
}

.miette-pg-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 0.5px solid rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

.miette-pg-dot-red {
  background: #ff5f57;
}

.miette-pg-dot-yellow {
  background: #febc2e;
}

.miette-pg-dot-green {
  background: #28c840;
}

.miette-pg-term-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: var(--miette-term-fg-muted);
  font-family: var(--vp-font-family-mono);
  letter-spacing: 0.02em;
  pointer-events: none;
}

.miette-pg-term-body {
  margin: 0;
  padding: 20px 24px;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.55;
  color: var(--miette-term-fg);
  white-space: pre;
  overflow-x: auto;
  min-height: 360px;
  max-height: 560px;
  tab-size: 2;
}

/* ---------- Theme controls (terminal pane footer) ---------- */

.miette-pg-theme-header {
  display: flex;
  align-items: center;
}

.miette-pg-theme-header .miette-pg-meta-toggle {
  flex: 1;
}

.miette-pg-theme-reset {
  margin-right: 14px;
  background: transparent;
  border: 1px solid var(--miette-term-border);
  color: var(--miette-term-fg-muted);
  font-family: var(--vp-font-family-base);
  font-size: 10.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition:
    color 0.15s,
    border-color 0.15s,
    background-color 0.15s;
}

.miette-pg-theme-reset:hover {
  color: var(--miette-term-fg);
  border-color: var(--miette-term-accent-strong);
  background: rgba(120, 113, 198, 0.1);
}

.miette-pg-theme-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 14px 14px;
}

.miette-pg-theme-row {
  display: grid;
  grid-template-columns: 70px 1fr;
  align-items: center;
  gap: 10px;
}

.miette-pg-segmented {
  display: inline-flex;
  border: 1px solid var(--miette-term-border);
  border-radius: 5px;
  overflow: hidden;
  background: var(--miette-term-bg);
  width: fit-content;
}

.miette-pg-segmented button {
  background: transparent;
  border: none;
  color: var(--miette-term-fg-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 11.5px;
  padding: 5px 12px;
  cursor: pointer;
  transition:
    color 0.15s,
    background-color 0.15s;
}

.miette-pg-segmented button + button {
  border-left: 1px solid var(--miette-term-border);
}

.miette-pg-segmented button:hover {
  color: var(--miette-term-fg);
}

.miette-pg-segmented button.is-active {
  color: var(--miette-term-fg);
  background: rgba(120, 113, 198, 0.18);
}

.miette-pg-theme-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.miette-pg-theme-group-label {
  font-size: 10.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--miette-term-fg-subtle);
  font-family: var(--vp-font-family-mono);
}

.miette-pg-swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.miette-pg-swatch {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px 3px 4px;
  border: 1px solid var(--miette-term-border);
  border-radius: 5px;
  background: var(--miette-term-bg);
  cursor: pointer;
  transition:
    border-color 0.15s,
    background-color 0.15s;
}

.miette-pg-swatch:hover {
  border-color: var(--miette-term-accent-strong);
}

.miette-pg-swatch input[type="color"] {
  appearance: none;
  -webkit-appearance: none;
  border: none;
  width: 22px;
  height: 22px;
  padding: 0;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
}

.miette-pg-swatch input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

.miette-pg-swatch input[type="color"]::-webkit-color-swatch {
  border: 1px solid var(--miette-term-border);
  border-radius: 4px;
}

.miette-pg-swatch input[type="color"]::-moz-color-swatch {
  border: 1px solid var(--miette-term-border);
  border-radius: 4px;
}

.miette-pg-swatch-name {
  font-family: var(--vp-font-family-mono);
  font-size: 11.5px;
  color: var(--miette-term-fg-secondary);
  letter-spacing: 0.02em;
}
</style>
