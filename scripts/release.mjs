#!/usr/bin/env node
// Release script for the `miette` package.
//
// Usage:
//   pnpm release [patch|minor|major] [options]
//
// Options:
//   --dry-run                 Skip publish + push; preview the changelog entry.
//   --no-push                 Skip `git push` after a real release.
//   --ignore-local-changes    With --dry-run, ignore unclean tree / unsynced main.
//   --otp=CODE                Forward an npm 2FA code to `pnpm publish`.
//   --help, -h                Show this usage.
//
// What it does, in order:
//   1. Validates: clean tree, on main, in sync with origin/main, npm authenticated.
//   2. Reads current version, computes next from the bump type.
//   3. Walks commits since the last v* tag, groups them by conventional-commit
//      type (or [bracket] type), generates a CHANGELOG.md entry.
//   4. Updates packages/miette/package.json and prepends the entry to CHANGELOG.md.
//   5. Runs typecheck, tests, build.
//   6. Commits as `release: vX.Y.Z` and tags as `vX.Y.Z`.
//   7. Runs `pnpm publish --no-git-checks --access public` from the miette package.
//   8. Pushes commit + tag to origin (unless --no-push).
//
// If anything fails after step 6, you'll have a local commit + tag with no
// corresponding publish — recover with `git reset --hard HEAD~1 && git tag -d vX.Y.Z`.

import { execSync } from "node:child_process"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { createInterface } from "node:readline/promises"
import { argv, exit, stdin as input, stdout as output } from "node:process"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, "..")
const PKG_DIR = resolve(REPO_ROOT, "packages/miette")
const PKG_JSON_PATH = resolve(PKG_DIR, "package.json")
const CHANGELOG_PATH = resolve(REPO_ROOT, "CHANGELOG.md")
const GITHUB_REPO = "https://github.com/gabrielcsapo/miette"

const VALID_TYPES = ["major", "minor", "patch"]

// ─── CLI ──────────────────────────────────────────────────────
const args = parseArgs(argv.slice(2))

function parseArgs(argList) {
  const opts = {
    type: undefined,
    dryRun: false,
    noPush: false,
    ignoreLocalChanges: false,
    otp: undefined,
  }
  for (const a of argList) {
    if (a === "--help" || a === "-h") {
      console.log(`Usage: pnpm release [major|minor|patch] [--dry-run] [--no-push] [--ignore-local-changes] [--otp=CODE]

Without a bump type, the script prompts interactively.
--dry-run                 Skip publish + push; preview the changelog entry.
--no-push                 Skip \`git push\` after a real release.
--ignore-local-changes    With --dry-run, allow unclean tree / unsynced main.
--otp=CODE                Forward an npm 2FA code to \`pnpm publish\`.`)
      exit(0)
    } else if (a === "--dry-run") opts.dryRun = true
    else if (a === "--no-push") opts.noPush = true
    else if (a === "--ignore-local-changes") opts.ignoreLocalChanges = true
    else if (a.startsWith("--otp=")) opts.otp = a.slice("--otp=".length)
    else if (!a.startsWith("--") && !opts.type) opts.type = a
    else {
      console.error(`Unknown argument: ${a}`)
      exit(2)
    }
  }
  if (opts.ignoreLocalChanges && !opts.dryRun) {
    console.error(
      "Error: --ignore-local-changes can only be used with --dry-run.",
    )
    exit(2)
  }
  return opts
}

// ─── Helpers ──────────────────────────────────────────────────
function sh(cmd, opts = {}) {
  console.log(`$ ${cmd}`)
  execSync(cmd, { stdio: "inherit", cwd: REPO_ROOT, ...opts })
}

function shCapture(cmd, opts = {}) {
  return execSync(cmd, { encoding: "utf8", cwd: REPO_ROOT, ...opts }).trim()
}

async function ask(question) {
  const rl = createInterface({ input, output })
  try {
    return (await rl.question(question)).trim()
  } finally {
    rl.close()
  }
}

function bump(version, type) {
  const m = /^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/.exec(version)
  if (!m) throw new Error(`Cannot parse version: ${version}`)
  let [major, minor, patch] = [Number(m[1]), Number(m[2]), Number(m[3])]
  if (type === "major") {
    major++
    minor = 0
    patch = 0
  } else if (type === "minor") {
    minor++
    patch = 0
  } else if (type === "patch") {
    patch++
  } else throw new Error(`Unknown bump type: ${type}`)
  return `${major}.${minor}.${patch}`
}

function semverCompare(a, b) {
  const pa = a.replace(/^v/, "").split(".").map(Number)
  const pb = b.replace(/^v/, "").split(".").map(Number)
  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i]
  }
  return 0
}

// Parses a commit subject into { type, scope, description }. Handles three styles:
//   `feat: description`
//   `feat(scope): description`
//   `[chore] description`
function classifyCommit(subject) {
  const conventional = /^(\w+)(?:\(([^)]+)\))?!?:\s*(.+)/.exec(subject)
  if (conventional) {
    return {
      type: conventional[1].toLowerCase(),
      scope: conventional[2],
      description: conventional[3],
    }
  }
  const bracket = /^\[(\w+)\]\s*(.+)/.exec(subject)
  if (bracket) {
    return {
      type: bracket[1].toLowerCase(),
      scope: undefined,
      description: bracket[2],
    }
  }
  return { type: "other", scope: undefined, description: subject }
}

function buildChangelogEntry(newVersion, tagName, lastTag, commits) {
  const categories = {
    feat: { title: "Features", commits: [] },
    fix: { title: "Bug Fixes", commits: [] },
    perf: { title: "Performance", commits: [] },
    refactor: { title: "Refactoring", commits: [] },
    docs: { title: "Documentation", commits: [] },
    test: { title: "Tests", commits: [] },
    chore: { title: "Chores", commits: [] },
    other: { title: "Other", commits: [] },
  }

  // Aliases that fold into a canonical bucket.
  const aliases = {
    bug: "fix",
    feature: "feat",
    doc: "docs",
    perfomance: "perf",
  }

  for (const commit of commits) {
    const { type, scope, description } = classifyCommit(commit.subject)
    const canonical = aliases[type] ?? type
    const target = categories[canonical] ?? categories.other
    const line = scope ? `**${scope}:** ${description}` : description
    target.commits.push({ hash: commit.hash, description: line })
  }

  const date = new Date().toISOString().split("T")[0]
  const compareUrl = lastTag
    ? `${GITHUB_REPO}/compare/${lastTag}...${tagName}`
    : `${GITHUB_REPO}/releases/tag/${tagName}`

  let entry = `## [${newVersion}](${compareUrl}) (${date})\n\n`
  for (const category of Object.values(categories)) {
    if (category.commits.length === 0) continue
    entry += `### ${category.title}\n\n`
    for (const c of category.commits) {
      const short = c.hash.substring(0, 7)
      entry += `- ${c.description} ([${short}](${GITHUB_REPO}/commit/${c.hash}))\n`
    }
    entry += "\n"
  }
  return entry
}

function prependChangelog(entry) {
  const header =
    "# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n"
  let existing = ""
  if (existsSync(CHANGELOG_PATH)) {
    existing = readFileSync(CHANGELOG_PATH, "utf8")
    existing = existing.replace(
      /^# Changelog\n\nAll notable changes[^\n]*\n\n/,
      "",
    )
  }
  writeFileSync(CHANGELOG_PATH, header + entry + existing)
}

// ─── Main ────────────────────────────────────────────────────
async function main() {
  const pkg = JSON.parse(readFileSync(PKG_JSON_PATH, "utf8"))
  const current = pkg.version

  // Bump type
  let type = args.type
  if (!type) {
    console.log(`Current version: ${current}`)
    console.log(`  major → ${bump(current, "major")}`)
    console.log(`  minor → ${bump(current, "minor")}`)
    console.log(`  patch → ${bump(current, "patch")}`)
    type = (await ask("\nBump type? (major/minor/patch): ")).toLowerCase()
  }
  if (!VALID_TYPES.includes(type)) {
    console.error(
      `Invalid bump type: ${type}. Expected one of: ${VALID_TYPES.join(", ")}.`,
    )
    exit(2)
  }
  const next = bump(current, type)
  const tagName = `v${next}`

  // Pre-flight: branch
  const branch = shCapture("git rev-parse --abbrev-ref HEAD")
  if (branch !== "main") {
    if (args.ignoreLocalChanges) {
      console.warn(
        `Warning: on branch "${branch}", not "main" (ignored via --ignore-local-changes).`,
      )
    } else {
      const ok = await ask(
        `You're on branch "${branch}", not "main". Continue? [y/N] `,
      )
      if (ok.toLowerCase() !== "y") exit(1)
    }
  }

  // Pre-flight: clean tree
  const status = shCapture("git status --porcelain")
  if (status) {
    if (args.ignoreLocalChanges) {
      console.warn(
        "Warning: working tree is not clean (ignored via --ignore-local-changes).",
      )
    } else {
      console.error("Error: working tree is not clean. Commit or stash first:")
      console.error(status)
      exit(1)
    }
  }

  // Pre-flight: in sync with origin/main
  try {
    shCapture("git fetch origin main")
    const local = shCapture("git rev-parse HEAD")
    const remote = shCapture("git rev-parse origin/main")
    if (local !== remote) {
      if (args.ignoreLocalChanges) {
        console.warn(
          "Warning: local branch differs from origin/main (ignored via --ignore-local-changes).",
        )
      } else {
        console.error(
          "Error: local branch is not up to date with origin/main. Pull first.",
        )
        exit(1)
      }
    }
  } catch {
    console.warn("Warning: could not verify remote status. Continuing.")
  }

  // Pre-flight: npm auth
  if (!args.dryRun) {
    try {
      shCapture("npm whoami")
    } catch {
      console.error("Error: not authenticated with npm. Run `npm login` first.")
      exit(1)
    }
  }

  // Pre-flight: tag doesn't already exist
  const allTags = shCapture("git tag -l")
    .split("\n")
    .filter((t) => /^v\d+\.\d+\.\d+$/.test(t))
  if (allTags.includes(tagName)) {
    console.error(`Error: tag '${tagName}' already exists.`)
    exit(1)
  }

  // Gather commits since last tag.
  const lastTag = allTags.sort(semverCompare).pop()
  const range = lastTag ? `${lastTag}..HEAD` : "HEAD"
  const raw = shCapture(`git log ${range} --format="%H|||%s" --no-merges`)
  if (!raw) {
    console.error("Error: no commits since last release.")
    exit(1)
  }
  const commits = raw
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [hash, ...rest] = line.split("|||")
      return { hash, subject: rest.join("|||") }
    })

  const entry = buildChangelogEntry(next, tagName, lastTag, commits)

  console.log(
    `\nReleasing miette: ${current} → ${next} (${type})${
      args.dryRun ? "  [dry run]" : ""
    }`,
  )
  console.log(`\n--- changelog preview ---\n${entry}--- end preview ---\n`)
  const ok = await ask("Proceed? [y/N] ")
  if (ok.toLowerCase() !== "y") {
    console.log("Aborted.")
    exit(0)
  }

  // Validate the package builds cleanly first.
  sh("pnpm --filter miette run typecheck")
  sh("pnpm --filter miette run test")
  sh("pnpm --filter miette run build")

  if (args.dryRun) {
    console.log(
      "\n[dry run] Would prepend CHANGELOG.md, bump package.json, commit, tag, publish, push.",
    )
    console.log(`[dry run] Recover with: (no local changes were committed)`)
    return
  }

  // Write files.
  prependChangelog(entry)
  console.log(`Updated ${CHANGELOG_PATH}`)
  pkg.version = next
  writeFileSync(PKG_JSON_PATH, JSON.stringify(pkg, null, 2) + "\n")
  console.log(`Updated packages/miette/package.json → ${next}`)

  // Commit + tag.
  sh(
    `git add ${JSON.stringify(CHANGELOG_PATH)} ${JSON.stringify(PKG_JSON_PATH)}`,
  )
  sh(`git commit -m "release: miette v${next}"`)
  sh(`git tag -a ${tagName} -m "v${next}"`)

  // Publish.
  const otpFlag = args.otp ? ` --otp=${args.otp}` : ""
  sh(`pnpm publish --no-git-checks --access public${otpFlag}`, { cwd: PKG_DIR })

  // Push.
  if (args.noPush) {
    console.log("\nSkipping push (--no-push). Run manually:")
    console.log("  git push origin main --follow-tags")
  } else {
    sh("git push origin main --follow-tags")
  }

  console.log(`\n✓ Released miette v${next}`)
  console.log(`  npm:    https://www.npmjs.com/package/miette/v/${next}`)
  console.log(`  github: ${GITHUB_REPO}/releases/tag/${tagName}`)
}

main().catch((e) => {
  console.error(`\n✗ Release failed: ${e.message ?? e}`)
  console.error("If a commit or tag was created locally, undo with:")
  console.error("  git reset --hard HEAD~1")
  console.error("  git tag -d v<version>")
  exit(1)
})
