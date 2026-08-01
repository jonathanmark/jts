---
name: format-technical-doc
description: 'Professionally format Markdown (.md) technical documents for online publishing. Use when: user asks to format, polish, restructure, clean up, or standardize a Markdown document; prepare a technical doc/README/guide/article for upload or publishing online; enforce heading hierarchy, code blocks, tables, lists, links, image paths, YAML front matter; remove emojis; convert informal notes into professional documentation. Do NOT use for: HTML, PDF, or LaTeX documents; translating content; writing brand-new docs from scratch without an existing draft.'
argument-hint: 'Path to the .md file to format (optional)'
user-invocable: true
disable-model-invocation: false
---

# Professional Markdown Technical Document Formatting

Formats existing Markdown documents into clean, consistent, publication-ready technical documents suitable for uploading to web platforms (docs sites, GitHub, blogs, knowledge bases).

## When to Use

- User asks to "format", "polish", "restructure", "clean up", or "standardize" a `.md` file.
- User wants a technical document prepared for **online publishing / upload**.
- User wants consistent headings, code blocks, tables, lists, or links.
- User wants emojis removed.
- User wants YAML front matter added.
- User wants informal notes turned into a professional technical document.

## Core Rules (Non-Negotiable)

1. **No emojis anywhere** — in headings, body text, lists, or tables. Remove all emoji characters and emoji-style glyphs. Never add them.
2. **Preserve technical content and meaning** — format, never fabricate. Do not invent facts, code, or measurements. Do not delete substantive content without the user's approval.
3. **Keep line wrapping readable** — wrap prose at ~100 characters where practical, one sentence per line is acceptable.
4. **Use American English spelling** in new or rewritten text.
5. **Never use emoji-style bullets or icons**; use standard Markdown (`-`, `1.`, `|`, `` ` ``).

## Procedure

### 1. Read and Assess
- Read the target `.md` file(s) in full.
- Identify: current heading structure, emoji usage, code blocks without language tags, broken links/images, missing front matter, inconsistent lists/tables.
- Report a short summary of issues found before editing (if the doc is large) or just proceed for small docs.

### 2. Add YAML Front Matter (if requested or appropriate for web publishing)
- Insert at the very top, before any content, wrapped in `---` lines:
  ```yaml
  ---
  title: <Document Title>
  description: <One-sentence summary, no emojis>
  date: <YYYY-MM-DD or YYYY-MM-DD HH:MM:SS>
  tags:
    - <tag>
  ```
- Only add fields you can derive from the document; never invent dates or tags — ask the user or leave them as placeholders like `<date>`.

### 3. Structure Headings
- Exactly **one** `#` (H1) — the document title. Move any extra H1s down to H2.
- Nest logically: `##` → `###` → `####`; never skip levels (e.g., `#` → `###`).
- Use **Title Case** for H1/H2, **Sentence case** for H3+ (see reference).
- No trailing punctuation, colons, or emojis in headings. Numbered section headings (`## 1. Overview`) are allowed only if the whole document uses them consistently.
- Add a table of contents for documents longer than ~15 headings, using relative anchor links.

### 4. Format Body Text
- Remove emojis and emoji-style characters from all text.
- Convert ALL-CAPS phrases, underlines, and bold headings into proper headings or normal text.
- Bold only key terms on first mention; use `*emphasis*` sparingly.
- Fix spacing: exactly one space between sentences, no double spaces, no trailing whitespace, exactly one blank line between blocks.
- Convert informal tone to professional technical tone (e.g., "you just need to" → "use"; "a bunch of" → "several").

### 5. Format Code Blocks
- Add a **language tag** to every fenced code block (e.g., ` ```python `, ` ```bash `, ` ```json `).
- Use consistent fence length (triple backticks) everywhere; no indented code blocks.
- Keep inline code (`` ` ``) for commands, variables, filenames, and symbols.
- Add a brief caption line above a code block when context is needed (plain text, not a heading).
- Break long code lines at reasonable points only if it does not change behavior.

### 6. Format Lists and Tables
- Use `-` for unordered lists, `1.` for ordered lists — consistently, never mixing.
- Use "Oxford comma" in prose lists and list items.
- End list items with a period only if they are full sentences; be consistent within a list.
- Tables: always include a header row and a separator row (`|---|---|`). Align with `:` for numeric columns. Keep table cells concise; no emojis.
- Convert tabbed/space-aligned pseudo-tables into real Markdown tables.

### 7. Fix Links and References
- Use **relative links** for files inside the same site/repo (e.g., `[docs](./docs/api.md)`), full URLs for external resources.
- Normalize anchors to match actual heading slugs (`#my-section` for `## My Section`).
- Use descriptive link text — never "click here" or bare URLs as link text (bare URLs are acceptable in reference sections).
- Add `alt` text to every image.

### 8. Handle Images and Assets
- Use relative paths for images that will be uploaded with the doc (e.g., `![Diagram](./assets/diagram.png)`), matching the actual file layout.
- Normalize image syntax to `![alt text](path)`; remove HTML `<img>` tags unless required.
- Note to the user which local image paths need to be uploaded alongside the document.

### 9. Final Quality Pass
- Remove stray emojis, double spaces, trailing whitespace, and duplicate blank lines.
- Verify heading levels, code fences, table pipes, and link anchors.
- Verify one blank line before and after every heading, code block, and table.
- Confirm the document opens cleanly in a Markdown preview.

## Deliverable
- A fully formatted `.md` file in place (same path unless the user requests a new one).
- A concise summary of what changed, plus a checklist of any assets (images, referenced files) the user must upload alongside the document.

## Resources
- Detailed style guide: [references/formatting-guide.md](./references/formatting-guide.md)
- Document template: [assets/template.md](./assets/template.md)
