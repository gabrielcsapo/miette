---
layout: page
sidebar: false
aside: false
pageClass: page-home
---

<div class="miette-hero">
  <h1 class="miette-hero-title">miette</h1>
  <p class="miette-hero-tag">
    Fancy upgrade to <code>console.log</code> — annotated, source-aware error diagnostics for TypeScript.
    Zero runtime dependencies. Works in Node and the browser.
  </p>
</div>

<ClientOnly>
  <Playground />
</ClientOnly>

<div class="miette-pitch">

  <div class="miette-cta-buttons">
    <a class="miette-btn miette-btn-primary" href="./usage">Get started →</a>
    <a class="miette-btn miette-btn-secondary" href="./api">API reference</a>
    <a class="miette-btn miette-btn-secondary" href="https://github.com/gabrielcsapo/miette">GitHub</a>
  </div>

  <div class="miette-feature-grid">
    <div class="miette-feature">
      <div class="miette-feature-icon">⊕</div>
      <h3>Annotated source</h3>
      <p>Highlight spans of the offending code with labels, in a familiar <a href="https://github.com/zkat/miette" target="_blank" rel="noopener">Rust-style report</a>. No more decoding a stack trace to find the column.</p>
    </div>
    <div class="miette-feature">
      <div class="miette-feature-icon">⊗</div>
      <h3>Zero dependencies</h3>
      <p>A few hundred lines of TypeScript. No transitive tree to audit. Drops cleanly into any project.</p>
    </div>
    <div class="miette-feature">
      <div class="miette-feature-icon">⊜</div>
      <h3>Cause chains</h3>
      <p>ES2022 <code>Error.cause</code> is walked and rendered automatically. Wrap your errors however deep — the whole story prints.</p>
    </div>
    <div class="miette-feature">
      <div class="miette-feature-icon">⊙</div>
      <h3>Node and browser</h3>
      <p>Pure string output. Pipe it into <code>process.stderr</code>, an HTML <code>&lt;pre&gt;</code>, an <code>xterm.js</code> session — whatever you have.</p>
    </div>
  </div>

</div>

<style>
.miette-hero {
  max-width: 880px;
  margin: 48px auto 32px;
  padding: 0 24px;
  text-align: center;
}

.miette-hero-title {
  font-size: 72px;
  line-height: 1.05;
  font-weight: 800;
  margin: 0 0 16px;
  background: linear-gradient(135deg, #c084fc 0%, #75b5aa 50%, #f59e0b 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  letter-spacing: -0.02em;
}

@media (max-width: 640px) {
  .miette-hero-title {
    font-size: 48px;
  }
}

.miette-hero-tag {
  font-size: 19px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  margin: 0;
}

.miette-hero-tag code {
  font-size: 0.92em;
  padding: 2px 6px;
  background: var(--vp-c-bg-alt);
  border-radius: 4px;
  color: var(--vp-c-text-1);
}

.miette-pitch {
  max-width: 1100px;
  margin: 16px auto 80px;
  padding: 0 24px;
}

.miette-cta-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin: 0 0 64px;
}

.miette-btn {
  display: inline-block;
  padding: 12px 22px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none !important;
  border: 1px solid transparent;
  transition: background-color 0.15s, border-color 0.15s, transform 0.05s;
}

.miette-btn:active {
  transform: translateY(1px);
}

.miette-btn-primary {
  background: var(--vp-c-brand-1);
  color: white !important;
  border-color: var(--vp-c-brand-1);
}

.miette-btn-primary:hover {
  background: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
}

.miette-btn-secondary {
  background: transparent;
  color: var(--vp-c-text-1) !important;
  border-color: var(--vp-c-divider);
}

.miette-btn-secondary:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand-1);
}

.miette-feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-top: 32px;
}

.miette-feature {
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.miette-feature-icon {
  font-size: 24px;
  color: var(--vp-c-brand-1);
  margin-bottom: 8px;
  font-family: var(--vp-font-family-mono);
  font-weight: 600;
}

.miette-feature h3 {
  font-size: 16px;
  margin: 0 0 8px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.miette-feature p {
  font-size: 14px;
  line-height: 1.55;
  color: var(--vp-c-text-2);
  margin: 0;
}

.miette-feature code {
  font-size: 0.9em;
  padding: 1px 5px;
  background: var(--vp-c-bg-alt);
  border-radius: 3px;
  color: var(--vp-c-text-1);
}

.miette-feature a {
  color: var(--vp-c-brand-1);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.15s;
}

.miette-feature a:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
}
</style>
