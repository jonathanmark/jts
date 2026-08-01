# Formatting Guide for Technical Markdown Documents

Detailed style rules referenced by the `format-technical-doc` skill. Load this file when the user needs justification for a specific formatting decision or when a document is large/complex.

## Typography and Tone

- **No emojis.** Remove every emoji, emoticon, and emoji-style glyph. This is absolute.
- Use professional, concise, technical tone. Prefer active voice.
- Second person ("you") is acceptable in tutorials; third person or passive in reference/spec docs. Be consistent within one document.
- American English: `optimize`, `color`, `center`, `behavior`, `analyze`.
- No slang, contractions in formal docs are optional but avoid excessive informality.
- Numbers: use numerals for 10 and above, spell out one through nine (unless in tables, code, or measurements).
- Units: use standard abbreviations with a space (`10 MB`, `5 GHz`, `3 s`).
- Acronyms: expand on first use, e.g., "Application Programming Interface (API)".

## Heading Conventions

| Level | Case | Example |
|-------|------|---------|
| H1 (`#`) | Title Case | `# Introduction to the API` |
| H2 (`##`) | Title Case | `## Getting Started` |
| H3 (`###`) | Sentence case | `### Installing the SDK` |
| H4 (`####`) | Sentence case | `#### Environment variables` |

- One H1 per document, matching the `title` in front matter (with a `# ` prefix).
- Do not skip levels: `#` then `###` is invalid.
- Headings have no trailing period, colon, or emoji.
- Avoid stacking two headings with no content between them.

## Paragraphs and Spacing

- One blank line between paragraphs, before/after headings, code blocks, lists, and tables.
- No trailing whitespace on any line.
- One space between sentences. No double spaces.
- Wrap prose around 100 characters; never exceed 120.

## Code Blocks

- Always use fenced code blocks with a language tag:
  ````markdown
  ```python
  def main():
      print("hello")
  ```
  ````
- Use consistent triple-backtick fences. Convert indented (4-space) code blocks to fenced blocks.
- Inline code for: commands, flags, filenames, paths, variables, keys, and symbols.
- Caption above the block in plain text, e.g., `Example: creating a client`.
- Do not alter code semantics. Only fix indentation if it is clearly broken.

## Lists

- Unordered: `- item` (never `*` or `+` mixed in the same document).
- Ordered: `1. item` (Markdown auto-numbers; keep `1.` for simplicity).
- Consistent punctuation: end full sentences with a period; end fragments without. Pick one per list.
- No blank line between the list introduction and the first item; blank lines between list items only when items contain multiple paragraphs.
- Nested lists: indent two spaces.

## Tables

- Always: header row, separator row, then data rows.
  ```markdown
  | Method | Returns | Thread-safe |
  | ------ | ------- | :---------: |
  | `get`  | `Value` |     No      |
  ```
- Use `:---` for left, `---:` for right, `:---:` for center alignment.
- Keep cells concise. Use `<br>` sparingly if needed; prefer multiple rows.
- No emojis in cells. Code identifiers in backticks.

## Links

- Relative for same-repo/site files: `[Configuration](./config.md)`.
- Absolute URLs for external: `[Markdown Guide](https://www.markdownguide.org/)`.
- Descriptive link text; avoid "click here", "this", "here".
- Anchors must match heading slugs (lowercase, spaces to hyphens, strip punctuation).
- For sections with a table of contents, use anchor links to headings.

## Images

- `![Descriptive alt text](./assets/image.png)` — relative path preferred for uploads.
- Alt text describes content; empty `![](...)` only for decorative images.
- Reference the file name so the user knows which assets to upload.
- Prefer `png`, `svg`, or `webp`; note large binaries for the user to compress.

## Front Matter

- YAML between `---` markers at the very top of the file.
- Standard fields: `title`, `description`, `date`, `tags`.
- Title should match the H1 (without the `#`).
- Never invent dates or tags; use `<date>`, `<tag>` placeholders and flag them to the user.

## Common Fixes Checklist

- [ ] No emojis anywhere
- [ ] Single H1, correct H2–H4 nesting, no skipped levels
- [ ] Language tag on every fenced code block
- [ ] Real Markdown tables (header + separator row)
- [ ] Consistent list markers and punctuation
- [ ] Relative links for local files, alt text on images
- [ ] Front matter present and valid
- [ ] No trailing whitespace, no double blank lines, one space between sentences
- [ ] Preview renders cleanly
