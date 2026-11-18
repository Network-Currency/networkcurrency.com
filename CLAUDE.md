# networkcurrency.com: agent entry point

The website of Network Currency LLC: technology advisory (consulting) and the company's
apps (Obliger and future micro apps). A static site built with Astro and served by GitHub
Pages at networkcurrency.com.

This file holds the rules you must not break and explains how the site works. Rules for
code, content and workflow are in [`CONVENTIONS.md`](CONVENTIONS.md).

## Read in this order

1. This file.
2. [`CONVENTIONS.md`](CONVENTIONS.md): workflow, code, content and writing rules.

There is **no `ARCHITECTURE.md`, by design.** The site has no database, server, background
jobs or security model to explain. Everything an architecture document would hold is in
"How the site works" below. Do not ask for one or create one. If the site ever gains a
backend, a form handler or third-party services, that is the time to reconsider.

## Hard rules

**Claude Code builds structure. It never writes content.** Every word a visitor reads lives
in a content file under `src/content/`, and those files are written only by the owner, or by
the owner with Claude in a chat conversation. Claude Code never creates, edits, renames or
deletes a file under `src/content/`, including images there. This covers page copy too:
headlines, intros, button labels and the footer line are content.

- If a structural change needs a new content field, add it to the schema in
  `src/content.config.ts`, make it optional or give it a default so the build still passes,
  and report that the field exists and needs content. Do not fill it in.
- If the build fails because of a content file, report the file and the error. Do not fix it.
- Placeholder text inside a layout or component is not allowed, even temporarily. A missing
  value renders nothing or fails the build with a clear message.

**No tracking, cookies, forms or third-party scripts.** The Legal page tells visitors the site
collects nothing. Adding analytics, a form, an embed, a font CDN or any script that loads from
another domain is an owner decision, never a side effect of other work. Inter is self-hosted.

**Colors and type come from the design tokens** in `src/styles/tokens.css`. No hex, rgb or
named colors in components or layouts. Inter is the only typeface.

**DNS carries email.** The networkcurrency.com DNS zone also holds the records for the
company's email. Any DNS change adds or edits only the GitHub Pages and verification records.
Never remove or change MX, SPF, DKIM or DMARC records.

**Secrets.** The site needs none. Never commit a token, key or `.env` file.

**Punctuation.** Never use an em dash, in code comments, documents or anything else.

## How the site works

### Build and deploy

Astro reads the content files and the layouts and writes plain HTML and CSS to `dist/`. Nothing
runs on a server. A push to `main` triggers `.github/workflows/deploy.yml`, which runs the type
and content check, builds the site and deploys it to GitHub Pages. If the check or the build
fails, nothing deploys and the live site is unchanged. The custom domain is set by
`public/CNAME`. Exact versions are in `package.json`.

### Content model

Content lives in collections under `src/content/`. Each collection is defined in
`src/content.config.ts`, which is structure and is owned by Claude Code. A file's place on the
site is decided entirely by its fields, so adding, hiding or removing an item never needs a
layout change.

| Collection | Files | One file per | Where it appears |
|---|---|---|---|
| `pages` | YAML | page, plus `site.yaml` for site-wide copy (name, nav, footer, contact details, status labels) | the matching route; `site.yaml` everywhere |
| `services` | Markdown | consulting service: `name`, `shortName`, `order`, `engagements`, optional `showWriting` and `writingLinkLabel`; the body is the description | Consulting, by `order`; Home lists `shortName`s |
| `cases` | YAML | case study: `title`, `client`, `service`, `situation`, `did`, `result`, optional `metric` and `metricLabel`, `featured`, `order` | under its `service` on Consulting, by `order`; Home when `featured` |
| `apps` | YAML | app: `name`, `tagline`, `description`, `status`, `initial`, `tile`, `order`, `links` | Apps, by `order`; Home lists those not `hidden` |
| `writing` | Markdown | article, framework, talk or press item: `title`, `type`, optional `typeDetail`, `date`, `summary`, `url`, `linkedin`, `featured`, `highlight`, `order`; optional body | AI Governance library; Home when `featured`; the AI Governance featured card when `highlight` |

Rules the layouts implement:

- `service` on a case must match a service `name` exactly, or the build fails.
- `status` on an app is `live`, `in-development` or `hidden`. `hidden` removes it from every page
  without deleting the file. The label shown for each status comes from `site.yaml`.
- `tile` on an app is `accent` or `navy`, the color of its initial tile until an icon image exists.
- `type` on a writing item is `Framework`, `Article`, `Talk` or `Press`.
- A writing item with a body is hosted at `/ai-governance/<slug>/` and ends with a link to its
  LinkedIn discussion when `linkedin` is set. One without a body links to its `url`.
- Writing is listed newest `date` first, then by `order`; items without a date follow dated ones.
- Optional fields that are absent render nothing. A section whose list is empty is not shown.
- Lists grow by adding files. Grids and rows reflow at any count.

### Pages

| URL | Content |
|---|---|
| `/` | Home |
| `/consulting/` | Services, each with its cases, then engagement models |
| `/ai-governance/` | Point of view, featured piece, library |
| `/ai-governance/<slug>/` | One hosted writing item |
| `/apps/` | Apps, one full-width row each |
| `/about/` | Bio, career path, leadership principles |
| `/legal/` | Entity details, website privacy notice, links to app policies |

### Design

The visual design is the approved mockups in `design/` (exported from the canvas "Network
Currency Website" in claude.ai). `design/README.md` explains them and lists the tokens. The tokens are the
Obliger design system's (navy, one blue accent, Inter, 20px card radius), held as CSS custom
properties in `src/styles/tokens.css`. Header, footer, cards and buttons are shared components
in `src/components/`.

## Where things are

```
design/               approved mockups and token reference (never deployed)
src/content/          content files: owner only (pages, services, cases, apps, writing)
src/content.config.ts collection schemas
src/pages/            routes
src/layouts/          page layouts
src/components/       shared components (Header, Footer, cards, buttons)
src/styles/           tokens.css and global styles
public/               CNAME, favicon, self-hosted fonts
.github/workflows/    deploy.yml (check, build, deploy on push to main)
```
