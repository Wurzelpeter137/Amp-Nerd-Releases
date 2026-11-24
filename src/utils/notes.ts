/**
 * release-notes — port of the pure helpers in scripts/render-releases.mjs
 * (markdown subset, sizes, dates, installer detection) for use in the
 * Astro download pages. Release notes are rendered as HTML strings and
 * injected with set:html (Astro escapes nothing when we say so — the
 * output here is built only from escaped release data).
 *
 * The notes stay in their original German on both locales (D3); only the
 * dates, file names and locale-aware punctuation change.
 */

import type { Locale } from "../i18n";

/** One asset of a GitHub release. */
export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

/** One entry of `src/data/releases.json` (GitHub Releases API shape). */
export interface Release {
  name: string;
  tag_name: string;
  published_at: string;
  body: string;
  html_url: string;
  assets?: ReleaseAsset[];
}

export function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

/** Inline Markdown: `code`, **bold**, [text](url). Input must be escaped. */
function inline(md: string): string {
  return md
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(
      /\[([^\]]+)\]\((https?:[^\s)]+)\)/g,
      '<a href="$2" rel="noopener">$1</a>'
    );
}

/**
 * Block-level Markdown subset used by the Amp Nerd release notes:
 * #..### headings, -/* and 1. lists with lazy continuations, ---
 * rules, paragraphs. Returns an HTML string.
 */
export function renderNotes(markdown?: string | null): string {
  if (!markdown || !markdown.trim()) return "";
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let list: { kind: "ul" | "ol"; items: string[] } | null = null;
  let para: string[] = [];

  const closeList = () => {
    if (list) {
      out.push(
        `<${list.kind}>` +
          list.items.map((li) => `  <li>${li}</li>`).join("\n") +
          `\n</${list.kind}>`
      );
      list = null;
    }
  };
  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${para.join(" ")}</p>`);
      para = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushPara();
      closeList();
      continue;
    }
    let m: RegExpMatchArray | null;
    if ((m = line.match(/^#{1,3}\s+(.*)$/))) {
      flushPara();
      closeList();
      out.push(`<h3>${inline(escapeHtml(m[1]))}</h3>`);
    } else if (/^(-{3,}|\*{3,})$/.test(line)) {
      flushPara();
      closeList();
      out.push("<hr>");
    } else if ((m = line.match(/^[-*]\s+(.*)$/))) {
      flushPara();
      if (!list || list.kind !== "ul") {
        closeList();
        list = { kind: "ul", items: [] };
      }
      list.items.push(inline(escapeHtml(m[1])));
    } else if ((m = line.match(/^\d+\.\s+(.*)$/))) {
      flushPara();
      if (!list || list.kind !== "ol") {
        closeList();
        list = { kind: "ol", items: [] };
      }
      list.items.push(inline(escapeHtml(m[1])));
    } else if (list) {
      // Lazy continuation of the previous list item (notes wrap bullets
      // onto indented follow-up lines; GitHub Markdown does the same).
      list.items[list.items.length - 1] += " " + inline(escapeHtml(line));
    } else {
      para.push(inline(escapeHtml(line)));
    }
  }
  flushPara();
  closeList();
  return out.join("\n");
}

/** 12345 → "12,1 MB" (de) / "12.1 MB" (en); below 1 MB: "120 KB". */
export function formatSize(locale: Locale, bytes: number): string {
  if (bytes >= 1024 * 1024) {
    const mb = (bytes / (1024 * 1024)).toFixed(1);
    const num = locale === "de" ? mb.replace(".", ",") : mb;
    return `${num} MB`;
  }
  return `${Math.ceil(bytes / 1024)} KB`;
}

/** "dd. Month yyyy" (de) / "d Month yyyy" (en, British style). */
export function formatDate(locale: Locale, iso: string): string {
  try {
    return new Intl.DateTimeFormat(
      locale === "de" ? "de-DE" : "en-GB",
      { day: "numeric", month: "long", year: "numeric" }
    ).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** The installer assets of a release, one per OS (never `.sig` files). */
export function findInstallers(
  assets?: ReleaseAsset[]
): { win: ReleaseAsset | undefined; mac: ReleaseAsset | undefined } {
  const list = assets ?? [];
  const win = list.find((a) => /windows.*\.exe$/i.test(a.name));
  const mac = list.find((a) => /\.pkg$/i.test(a.name));
  return { win, mac };
}
