# Design reference

Approved mockups of the site, exported from the "Network Currency Website" design canvas in
claude.ai. This folder is a reference for building the layouts. It is never deployed and no
site code imports from it.

## Files

| File | Page |
|---|---|
| `home.dc.html` | `/` |
| `consulting.dc.html` | `/consulting/` |
| `ai-governance.dc.html` | `/ai-governance/` |
| `apps.dc.html` | `/apps/` |
| `about.dc.html` | `/about/` |

Each file is a design-tool document, not a working page: markup inside `<x-dc>`, sample data in
the `renderVals()` script at the bottom, `<sc-for>` for repeated items and `<sc-if>` for
conditional blocks. Read them for layout, spacing, type sizes, colors and component shapes.
The sample data in them is mockup data; the real copy is in `src/content/`.

There is no mockup for `/legal/` or for a hosted writing page (`/ai-governance/<slug>/`). Build
both from the same header, footer, container and type styles: a navy page header with the
headline, then a single readable text column (about 720px wide) on the light background.

## Tokens

From the Obliger design system. The site uses the light values for page content and the dark
(navy) values for the header, page heroes and the contact band.

| Token | Light | Dark (navy) | Use |
|---|---|---|---|
| bg | #F5F7FB | #0E1A3B | page background; navy hero and header |
| surface | #FFFFFF | #17264F | cards; secondary button on navy |
| fill-secondary | #EBEFF6 | #22335F | neutral chips, secondary buttons |
| border | #E8ECF4 | #22336A | card outlines, dividers |
| border-field | #DDE3EE | #2B3F78 | outlined buttons |
| ink | #0B1B3F | #EEF2FB | primary text |
| ink-muted | #55627E | #A9B4D0 | secondary text |
| accent | #2563EB | #6E9BFF | primary buttons, big numbers |
| on-accent | #FFFFFF | #0B1430 | text on accent |
| accent-soft | #E7EEFD | #23386F | service chips |
| accent-ink | #1D4ED8 | #A9C4FF | links, eyebrows |

- Radius: card 20px, large button 16px, inner panel 14px, chip and pill 999px.
- Shadow (cards, light only): `0 1px 2px rgba(11,27,63,0.04), 0 4px 14px rgba(11,27,63,0.05)`.
- Type: Inter 400, 500, 600, 700. Display headlines 56 to 72px, weight 700, letter-spacing
  about -0.03em. Section headings 36 to 40px. Body 16 to 19px.
- Container: max-width 1200px, side padding 40px (20px on phones).
- Logo mark: the network-node SVG in the header of every mockup. Use it for the favicon too.
