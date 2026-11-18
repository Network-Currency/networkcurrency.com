# networkcurrency.com: Conventions

Rules for workflow, code, content and writing that apply to anyone working in this
repository, human or AI. How the site works is in [`CLAUDE.md`](CLAUDE.md).

---

## System documents

This repository has three: `CLAUDE.md`, `CONVENTIONS.md` and `README.md`. There is no
`ARCHITECTURE.md` on purpose. A static site with no database, server or background jobs does
not need one, and the content model and deploy setup it would hold are in `CLAUDE.md`. Do not
request or create one unless the site gains a backend or third-party services.

---

## Workflow

- **Decisions before code.** What a page or feature does, how it looks and what it says are
  settled first, in conversation. Implementation prompts are written only after that.
- **Inspect, then report, then change.** Claude Code investigates and reports what it found
  and the diff it proposes. Nothing is applied until the owner approves explicitly.
- **Claude Code commits and pushes structure** to `main` after approval. A push deploys, so a
  push is a release.
- **Content goes through the owner.** Content files are written by the owner, or drafted by
  Claude in chat and approved line by line by the owner before they are committed. Claude
  Code never touches them (see `CLAUDE.md`).
- **Larger changes are split into named batches**, each its own prompt and commit. A prompt
  that grows too long is split into passes.
- **Documentation commits are separate from code commits.**
- **Testing happens once, at the end of a body of work**, not after each batch.
- Don't over-engineer for rare cases. Prefer the simple version and say what it doesn't cover.

---

## Code

### Structure

- One shared component per repeated element (header, footer, card types, buttons, chips).
  No copy-pasted variants.
- Layouts read everything they display from content collections. No copy, labels or sample
  data in `.astro` files.
- Lists come from collections and are sorted by an explicit field (`order` or `date`), never
  by file name.
- Delete dead code; do not comment it out.

### Styling

- Every color, radius, shadow and spacing value comes from `src/styles/tokens.css`. A new
  need gets a new token there, not a literal in a component.
- Inter only, self-hosted in `public/fonts/`, weights 400, 500, 600 and 700. No italic.
- Sentence case for headings, labels and buttons. No all-caps labels.
- Layouts are fluid: a `max-width` container, grids that reflow (`auto-fill` or `auto-fit`)
  and every page usable at 390px wide.

### Accessibility

- Real `<a href>` for navigation and real `<button>` for actions. Never a clickable `div`.
- Text meets 4.5:1 contrast against its background (3:1 at 24px and above). Check new token
  pairings before using them.
- Every image has `alt` text; decorative images and icons have `alt=""` or
  `aria-hidden="true"`.
- One `<h1>` per page, headings in order.
- Visible focus styles on every interactive element.

### JavaScript

- None by default. The site is HTML and CSS. Add client JavaScript only when a feature
  cannot work without it, and say so in the report.
- Nothing loads from another domain at runtime (see `CLAUDE.md`).

---

## Content files

These rules are for whoever writes content. Claude Code enforces them through the schemas,
not by editing files.

- **File names** are lowercase words joined by hyphens and become the URL slug where one
  exists: `ai-governance-playbook.md`.
- **Required fields** are defined in `src/content.config.ts`. A missing required field fails
  the build with the file name in the error.
- **Dates** in front matter are `YYYY-MM-DD`. Dates shown on the site read `Nov 18, 2026`.
- **Images** used by a content file live beside it in `src/content/<collection>/images/`
  and are referenced by relative path.
- **Clients in case studies are anonymized** (for example "Fortune 100 insurer"). Employers
  may be named.
- **Hiding versus deleting.** To take an app off the site temporarily, set
  `status: hidden`. To retire any item for good, delete the file; git keeps the history.

---

## Build and run

```bash
npm install          # once, and after package.json changes
npm run dev          # local preview at http://localhost:4321, updates as files change
npm run check        # type and content schema check
npm run build        # full build to dist/
```

- `npm run check` and `npm run build` pass before every commit.
- The deploy workflow runs the same check and build. A failure stops the deploy and leaves
  the live site as it was.
- `dist/` and `node_modules/` are never committed.
- Local path: `C:\Dev\GitHub\networkcurrency.com`, outside OneDrive.

## Manual testing

At the end of a body of work, the owner checks the changed pages on a desktop browser and
a phone: layout at both widths, every link, and the contrast of anything new. Report which
pages a change touched so the check is targeted.

---

## Writing style

### System documents

- System documents describe the site as it is now. History lives in git. No change logs,
  dates of changes, batch names or decision records in them.
- When a fact changes, replace the old statement. Do not annotate what it used to say.

### Punctuation and tone

- Never use an em dash.
- An en dash is fine for numeric ranges and as a short label separator right after a title.
- Never use a dash of either kind as a clause connector. Restructure into separate sentences
  or comma-separated clauses.
- Site copy is plain and specific. No filler, no invented numbers, no superlatives without
  evidence.
