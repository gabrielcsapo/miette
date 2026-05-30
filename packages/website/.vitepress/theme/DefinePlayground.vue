<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from "vue"
import { defineDiagnostic, type DiagnosticDef, type Severity } from "miette"

interface SnippetRow {
  id: number
  start: number
  end: number
  label: string
}

const HIGHLIGHT_PALETTE = [
  "rgb(255, 135, 162)",
  "rgb(150, 232, 133)",
  "rgb(62, 238, 210)",
  "rgb(234, 207, 182)",
  "rgb(130, 221, 255)",
  "rgb(255, 188, 242)",
]

function snippetColor(i: number): string {
  return HIGHLIGHT_PALETTE[i % HIGHLIGHT_PALETTE.length]
}

const code = ref("TS2345")
const url = ref("")
const severity = ref<Severity>("ERROR")
const messageTemplate = ref(
  "Argument of type '{actual}' is not assignable to '{expected}'.",
)
const helpTemplate = ref("Pass a {expected}, or change the parameter type.")

const argsJson = ref(
  JSON.stringify({ actual: "string", expected: "number" }, null, 2),
)
const source = ref(
  'function divide(a: number, b: number) { return a / b; }\n\ndivide(10, "two");\n',
)

let nextId = 1
const snippets = ref<SnippetRow[]>([
  { id: nextId++, start: 67, end: 72, label: "string passed here" },
])

function addSnippet() {
  snippets.value.push({ id: nextId++, start: 0, end: 1, label: "label" })
}

function removeSnippet(id: number) {
  snippets.value = snippets.value.filter((s) => s.id !== id)
}

type ParsedArgs =
  | { ok: true; value: Record<string, unknown> }
  | { ok: false; error: string }

const parsedArgs = computed<ParsedArgs>(() => {
  const raw = argsJson.value.trim()
  if (raw.length === 0) return { ok: true, value: {} }
  try {
    const v = JSON.parse(raw)
    if (typeof v !== "object" || v === null || Array.isArray(v)) {
      return { ok: false, error: "args must be a JSON object" }
    }
    return { ok: true, value: v as Record<string, unknown> }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
})

function interpolate(template: string, args: Record<string, unknown>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => {
    const v = args[k]
    return v === undefined ? `{${k}}` : String(v)
  })
}

const ansiConverter = shallowRef<{ toHtml: (s: string) => string } | null>(null)

onMounted(async () => {
  const ansiMod = await import("ansi-to-html")
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
})

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

const rawOutput = computed(() => {
  const args = parsedArgs.value
  if (!args.ok) {
    return `(args JSON is invalid: ${args.error})`
  }
  const argv = args.value

  const def: DiagnosticDef<Record<string, unknown>> = {
    code: code.value || undefined,
    severity: severity.value,
    message: (a) => interpolate(messageTemplate.value, a),
    help:
      helpTemplate.value.trim().length > 0
        ? (a) => interpolate(helpTemplate.value, a)
        : undefined,
    url: url.value.trim().length > 0 ? url.value : undefined,
  }

  try {
    const Defined = defineDiagnostic<Record<string, unknown>>(def)
    const err = new Defined({
      source: source.value,
      snippets: snippets.value
        .filter((s) => s.end > s.start)
        .map((s) => ({
          span: [s.start, s.end] as [number, number],
          label: s.label || undefined,
        })),
      args: argv,
    })
    return err.format()
  } catch (e) {
    return `(error: ${(e as Error).message})`
  }
})

const renderedHtml = computed(() => {
  const conv = ansiConverter.value
  if (!conv) return escapeHtml(rawOutput.value)
  return conv.toHtml(escapeHtml(rawOutput.value))
})

// The generated JS-source pseudo-snippet — read-only display of what the
// current panel state corresponds to in actual code. Updates live.
const generatedCode = computed(() => {
  const args = parsedArgs.value
  const argsObj = args.ok ? args.value : {}
  const sevLine =
    severity.value === "ERROR"
      ? ""
      : `\n  severity: ${JSON.stringify(severity.value)},`
  const urlLine = url.value.trim()
    ? `\n  url: ${JSON.stringify(url.value)},`
    : ""
  const helpLine = helpTemplate.value.trim()
    ? `\n  help: ({ ${Object.keys(argsObj).join(", ")} }) => \`${helpTemplate.value.replace(
        /\{(\w+)\}/g,
        "${$1}",
      )}\`,`
    : ""
  return `const ${code.value || "Diag"} = defineDiagnostic<${
    Object.keys(argsObj).length
      ? `{ ${Object.entries(argsObj)
          .map(([k, v]) => `${k}: ${typeof v}`)
          .join("; ")} }`
      : "void"
  }>({
  code: ${JSON.stringify(code.value)},${sevLine}
  message: ({ ${Object.keys(argsObj).join(", ")} }) => \`${messageTemplate.value.replace(
      /\{(\w+)\}/g,
      "${$1}",
    )}\`,${helpLine}${urlLine}
});

throw new ${code.value || "Diag"}({
  source,
  snippets: ${JSON.stringify(
      snippets.value
        .filter((s) => s.end > s.start)
        .map((s) => ({ span: [s.start, s.end], label: s.label || undefined })),
      null,
      2,
    )
      .split("\n")
      .join("\n  ")},
  args: ${JSON.stringify(argsObj, null, 2).split("\n").join("\n  ")},
});`
})
</script>

<template>
  <div class="miette-dpg">
    <div class="miette-dpg-grid">
      <section class="miette-dpg-pane">
        <header class="miette-dpg-pane-header">
          <span class="miette-dpg-dot miette-dpg-dot-red" />
          <span class="miette-dpg-dot miette-dpg-dot-yellow" />
          <span class="miette-dpg-dot miette-dpg-dot-green" />
          <span class="miette-dpg-pane-title">definition</span>
        </header>
        <div class="miette-dpg-body">
          <div class="miette-dpg-row miette-dpg-row-inline">
            <label class="miette-dpg-field miette-dpg-field-narrow">
              <span class="miette-dpg-key">code</span>
              <input
                v-model="code"
                class="miette-dpg-input"
                spellcheck="false"
              />
            </label>
            <label class="miette-dpg-field miette-dpg-field-narrow">
              <span class="miette-dpg-key">severity</span>
              <select v-model="severity" class="miette-dpg-input">
                <option value="ERROR">ERROR</option>
                <option value="WARNING">WARNING</option>
                <option value="ADVICE">ADVICE</option>
              </select>
            </label>
          </div>

          <label class="miette-dpg-field">
            <span class="miette-dpg-key">message template</span>
            <textarea
              v-model="messageTemplate"
              rows="2"
              class="miette-dpg-input miette-dpg-textarea"
              spellcheck="false"
              placeholder="Use {placeholder} for args"
            />
          </label>

          <label class="miette-dpg-field">
            <span class="miette-dpg-key">help template</span>
            <textarea
              v-model="helpTemplate"
              rows="2"
              class="miette-dpg-input miette-dpg-textarea"
              spellcheck="false"
            />
          </label>

          <label class="miette-dpg-field">
            <span class="miette-dpg-key">url</span>
            <input
              v-model="url"
              class="miette-dpg-input"
              spellcheck="false"
              placeholder="(optional)"
            />
          </label>
        </div>

        <header class="miette-dpg-section-header">args (JSON)</header>
        <div class="miette-dpg-body">
          <textarea
            v-model="argsJson"
            rows="5"
            class="miette-dpg-input miette-dpg-textarea miette-dpg-mono"
            spellcheck="false"
          />
          <div v-if="!parsedArgs.ok" class="miette-dpg-error">
            invalid JSON: {{ parsedArgs.error }}
          </div>
        </div>

        <header class="miette-dpg-section-header">per-throw input</header>
        <div class="miette-dpg-body">
          <label class="miette-dpg-field">
            <span class="miette-dpg-key">source</span>
            <textarea
              v-model="source"
              rows="6"
              class="miette-dpg-input miette-dpg-textarea miette-dpg-mono"
              spellcheck="false"
            />
          </label>

          <div class="miette-dpg-snippets-header">
            <span>snippets</span>
            <button type="button" class="miette-dpg-add" @click="addSnippet">
              + snippet
            </button>
          </div>
          <ul class="miette-dpg-snippet-list">
            <li
              v-for="(s, idx) in snippets"
              :key="s.id"
              class="miette-dpg-snippet"
              :style="{ '--snippet-color': snippetColor(idx) }"
            >
              <span class="miette-dpg-snippet-bar" aria-hidden="true" />
              <input
                v-model.number="s.start"
                type="number"
                class="miette-dpg-snippet-num"
                spellcheck="false"
              />
              <span class="miette-dpg-snippet-dash">→</span>
              <input
                v-model.number="s.end"
                type="number"
                class="miette-dpg-snippet-num"
                spellcheck="false"
              />
              <input
                v-model="s.label"
                type="text"
                class="miette-dpg-snippet-label"
                placeholder="label"
                spellcheck="false"
              />
              <button
                type="button"
                class="miette-dpg-snippet-remove"
                @click="removeSnippet(s.id)"
                aria-label="remove snippet"
              >
                ×
              </button>
            </li>
          </ul>
        </div>
      </section>

      <section class="miette-dpg-pane miette-dpg-output-pane">
        <header class="miette-dpg-pane-header">
          <span class="miette-dpg-dot miette-dpg-dot-red" />
          <span class="miette-dpg-dot miette-dpg-dot-yellow" />
          <span class="miette-dpg-dot miette-dpg-dot-green" />
          <span class="miette-dpg-pane-title">rendered output</span>
        </header>
        <pre class="miette-dpg-term" v-html="renderedHtml" />

        <header class="miette-dpg-section-header">equivalent code</header>
        <pre class="miette-dpg-codegen">{{ generatedCode }}</pre>
      </section>
    </div>
  </div>
</template>

<style scoped>
.miette-dpg {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 0 24px;
  box-sizing: border-box;
}

.miette-dpg-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: 20px;
  align-items: start;
}

@media (max-width: 960px) {
  .miette-dpg-grid {
    grid-template-columns: 1fr;
  }
}

.miette-dpg-pane {
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

.miette-dpg-pane-header,
.miette-dpg-section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--miette-term-chrome);
  border-bottom: 1px solid var(--miette-term-border);
  min-height: 38px;
  box-sizing: border-box;
}

.miette-dpg-section-header {
  font-size: 10.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--miette-term-fg-muted);
  border-top: 1px solid var(--miette-term-border);
}

.miette-dpg-pane-title {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--miette-term-fg-muted);
}

.miette-dpg-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 0.5px solid rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}
.miette-dpg-dot-red {
  background: #ff5f57;
}
.miette-dpg-dot-yellow {
  background: #febc2e;
}
.miette-dpg-dot-green {
  background: #28c840;
}

.miette-dpg-body {
  padding: 12px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.miette-dpg-row-inline {
  flex-direction: row;
  gap: 12px;
}

.miette-dpg-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.miette-dpg-field-narrow {
  flex: 1;
}

.miette-dpg-key {
  font-size: 10.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--miette-term-fg-subtle);
  font-family: var(--vp-font-family-mono);
}

.miette-dpg-input {
  border: 1px solid var(--miette-term-border);
  background: var(--miette-term-bg);
  border-radius: 5px;
  padding: 6px 10px;
  font-size: 12.5px;
  font-family: var(--vp-font-family-base);
  color: var(--miette-term-fg);
  outline: none;
  transition:
    border-color 0.15s,
    background-color 0.15s;
  width: 100%;
  box-sizing: border-box;
}

.miette-dpg-input:focus {
  border-color: var(--miette-term-accent-strong);
  background: rgba(120, 113, 198, 0.06);
}

.miette-dpg-textarea {
  resize: vertical;
  line-height: 1.45;
}

.miette-dpg-mono {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
}

.miette-dpg-error {
  color: var(--miette-term-danger);
  font-family: var(--vp-font-family-mono);
  font-size: 11.5px;
  padding: 4px 8px;
  background: rgba(255, 123, 114, 0.08);
  border: 1px solid rgba(255, 123, 114, 0.35);
  border-radius: 5px;
}

.miette-dpg-snippets-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--miette-term-fg-subtle);
  font-family: var(--vp-font-family-mono);
}

.miette-dpg-add {
  background: var(--miette-term-accent-soft);
  border: 1px solid var(--miette-term-accent-strong);
  color: var(--miette-term-accent);
  border-radius: 5px;
  padding: 3px 10px;
  font-size: 11.5px;
  font-family: var(--vp-font-family-base);
  cursor: pointer;
  transition:
    color 0.15s,
    border-color 0.15s,
    background-color 0.15s;
  letter-spacing: 0;
  text-transform: none;
  font-weight: 500;
}

.miette-dpg-add:hover {
  color: #fff;
  border-color: rgba(120, 113, 198, 0.95);
  background: rgba(120, 113, 198, 0.22);
}

.miette-dpg-snippet-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.miette-dpg-snippet {
  display: grid;
  grid-template-columns: 4px 60px 14px 60px 1fr auto;
  align-items: stretch;
  background: var(--miette-term-bg);
  border: 1px solid var(--miette-term-border);
  border-radius: 6px;
  overflow: hidden;
}

.miette-dpg-snippet-bar {
  background: var(--snippet-color);
}

.miette-dpg-snippet-num {
  background: transparent;
  border: none;
  color: var(--snippet-color);
  font-family: var(--vp-font-family-mono);
  font-size: 11.5px;
  padding: 6px 8px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  border-right: 1px solid var(--miette-term-border);
}

.miette-dpg-snippet-num:focus {
  background: rgba(120, 113, 198, 0.08);
}

.miette-dpg-snippet-dash {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--miette-term-fg-subtle);
  border-right: 1px solid var(--miette-term-border);
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
}

.miette-dpg-snippet-label {
  background: transparent;
  border: none;
  color: var(--miette-term-fg);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  padding: 6px 10px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  border-right: 1px solid var(--miette-term-border);
}

.miette-dpg-snippet-label:focus {
  background: rgba(120, 113, 198, 0.08);
}

.miette-dpg-snippet-label::placeholder {
  color: var(--miette-term-fg-subtle);
  font-style: italic;
}

.miette-dpg-snippet-remove {
  background: transparent;
  border: none;
  color: var(--miette-term-fg-subtle);
  cursor: pointer;
  width: 28px;
  font-size: 16px;
  line-height: 1;
  transition:
    color 0.15s,
    background-color 0.15s;
}

.miette-dpg-snippet-remove:hover {
  color: var(--miette-term-danger);
  background: var(--miette-term-danger-soft);
}

.miette-dpg-output-pane {
  color: var(--miette-term-fg-secondary);
}

.miette-dpg-term {
  margin: 0;
  padding: 20px 24px;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.55;
  color: var(--miette-term-fg);
  white-space: pre;
  overflow-x: auto;
  min-height: 220px;
  max-height: 380px;
  tab-size: 2;
  flex-shrink: 0;
}

.miette-dpg-codegen {
  margin: 0;
  padding: 16px 20px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 1.55;
  color: var(--miette-term-fg-muted);
  white-space: pre;
  overflow-x: auto;
  background: var(--miette-term-bg);
}
</style>
