#!/usr/bin/env node
/**
 * render-releases.mjs
 *
 * Materializes `releases.html` from the GitHub Releases API (D6 in
 * docs/documentation.md): the page is regenerated whenever a release is
 * published (GitHub Actions, `.github/workflows/render-releases.yml`) and the
 * result is committed back. Visitors never execute JavaScript.
 *
 * Dependencies: none. Only Node >= 18 (global fetch) and the filesystem.
 *
 * Environment:
 *   RELEASES_REPO   owner/repo to read releases from
 *                   (default: Wurzelpeter137/Amp-Nerd-Releases, so that the
 *                   fork's preview renders the same content as upstream)
 *   GITHUB_TOKEN    optional; raises the API rate limit
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPO =
  process.env.RELEASES_REPO || "Wurzelpeter137/Amp-Nerd-Releases";

const UPSTREAM = "https://github.com/Wurzelpeter137/Amp-Nerd-Releases";

/* ---------- small HTML helpers ---------- */

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

/** Inline Markdown: `code`, **bold**, [text](url). Input is already escaped. */
function inline(md) {
  return (
    md
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(
        /\[([^\]]+)\]\((https?:[^\s)]+)\)/g,
        '<a href="$2" rel="noopener">$1</a>'
      )
  );
}

/** Block-level Markdown subset used by the Amp Nerd release notes. */
function renderNotes(markdown) {
  if (!markdown || !markdown.trim()) return "";
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let list = null; // { kind: "ul" | "ol", items: [] }
  let para = [];

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
    let m;
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

/* ---------- page assembly ---------- */

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("de-DE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
  }
  return `${Math.ceil(bytes / 1024)} KB`;
}

function renderAssets(assets) {
  if (!assets?.length) return "";
  const rows = assets.map((a) => {
    const isSig = /\.sig$/i.test(a.name);
    const label = isSig
      ? 'GPG-Unterschrift <em class="sig">(signiert)</em>'
      : formatSize(a.size);
    return (
      `<div class="assets-row">` +
      `<a href="${escapeHtml(a.browser_download_url)}" rel="noopener">${escapeHtml(a.name)}</a>` +
      `<span class="size">${label}</span>` +
      `</div>`
    );
  });
  return `<div class="assets">${rows.join("\n")}</div>`;
}

/** The latest release, featured large: notes, assets + signatures, GitHub link. */
function renderFeatured(release) {
  return (
    `<div class="release featured">\n` +
    `  <div class="release-head">\n` +
    `    <span class="ver">${escapeHtml(release.name || release.tag_name)}</span>\n` +
    `    <span class="date">${formatDate(release.published_at)}</span>\n` +
    `  </div>\n` +
    `  <div class="release-body">\n` +
    `    <div class="release-notes">\n${renderNotes(release.body)}\n    </div>\n` +
    `    ${renderAssets(release.assets)}\n` +
    `    <p class="release-source"><a href="${escapeHtml(
      release.html_url
    )}" rel="noopener">Details bei GitHub &rarr;</a></p>\n` +
    `  </div>\n` +
    `</div>`
  );
}

/** A compact change-log entry: version, date, notes only — no assets, no buttons. */
function renderLogEntry(release) {
  return (
    `<div class="log-entry">\n` +
    `  <div class="log-head">\n` +
    `    <span class="ver">${escapeHtml(release.name || release.tag_name)}</span>\n` +
    `    <span class="date">${formatDate(release.published_at)}</span>\n` +
    `  </div>\n` +
    `  <div class="log-notes">\n${renderNotes(release.body)}\n  </div>\n` +
    `</div>`
  );
}

/**
 * The shared page chrome (header/footer) is copied verbatim from index.html,
 * with the active-nav state moved to "Releases" – so the static pages remain
 * the single source of truth for the site layout.
 */
function pageChrome() {
  const indexHtml = readFileSync(join(ROOT, "index.html"), "utf8");
  const headerMatch = indexHtml.match(/<header class="site">[\s\S]*?<\/header>/);
  const footerMatch = indexHtml.match(/<footer class="site-footer">[\s\S]*?<\/footer>/);
  if (!headerMatch || !footerMatch) {
    throw new Error("index.html: header/footer not found – chrome extraction broken");
  }
  // Move the active-nav state from "Start" (index) to "Releases".
  const header = headerMatch[0]
    .replace(/ class="active" aria-current="page"/g, "")
    .replace(
      /<a href="releases\.html">/,
      '<a href="releases.html" class="active" aria-current="page">'
    );
  return { header, footer: footerMatch[0] };
}

function renderPage(releases) {
  const { header, footer } = pageChrome();
  const generatedAt = new Date().toISOString().slice(0, 16).replace("T", " ");

  let body;
  if (!releases.length) {
    body =
      `<section class="section">\n  <div class="wrap">\n` +
      `    <h2>Keine Releases gefunden</h2>\n` +
      `    <p>Diese Seite wird automatisch aus den Releases des Repositories ` +
      `<a href="${UPSTREAM}/releases" rel="noopener">${REPO}</a> erzeugt.\n` +
      `    Sobald ein Release veröffentlicht wurde, läuft der Workflow\n` +
      `    <code>render-releases</code> und erzeugt diese Seite neu.</p>\n` +
      `  </div>\n</section>`;
  } else {
    const [featured, ...log] = releases;
    body =
      `<section class="section">\n  <div class="wrap">\n` +
      `    <p class="lead-in">\n` +
      `      Die neuste Version und das komplette Change Log – direkt aus den\n` +
      `      <a href="${UPSTREAM}/releases" rel="noopener">GitHub-Releases</a> übernommen.\n` +
      `      Diese Seite wird automatisch erzeugt und bei jedem neuen Release\n` +
      `      aktualisiert; der Quellworkflow ist\n` +
      `      <a href="${UPSTREAM}/blob/main/scripts/render-releases.mjs" rel="noopener">render-releases.mjs</a>.\n` +
      `    </p>\n` +
      `    ${renderFeatured(featured)}\n\n` +
      (log.length
        ? `    <h2 class="log-title">Ältere Versionen</h2>\n` +
          `    ${log.map(renderLogEntry).join("\n\n")}\n\n`
        : ``) +
      `    <p class="log-more"><a class="btn btn-gold" href="${UPSTREAM}/releases" rel="noopener">Alle Releases auf GitHub</a></p>\n` +
      `  </div>\n</section>`;
  }

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Releases &amp; Change Log · Amp Nerd</title>
  <meta name="description" content="Alle veröffentlichten Versionen von Amp Nerd mit Change Log und Installationsdateien (Windows-Setup, macOS-PKG, GPG-Unterschriften).">
  <link rel="stylesheet" href="style.css">
</head>
<body>
<!-- AUTO-GENERATED: scripts/render-releases.mjs, ${generatedAt} UTC – nicht manuell editieren -->
${header}

<main>
  ${body}
</main>

${footer}

</body>
</html>
`;
}

/* ---------- main ---------- */

async function main() {
  const headers = {
    "User-Agent": "amp-nerd-releases-renderer",
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const url =
    `https://api.github.com/repos/${REPO}/releases?per_page=30`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  }
  const releases = await res.json();

  const html = renderPage(releases);
  const target = join(ROOT, "releases.html");
  const previous = (() => {
    try {
      return readFileSync(target, "utf8");
    } catch {
      return null;
    }
  })();

  writeFileSync(target, html);
  if (previous === null || previous !== html) {
    console.log(
      `wrote ${target} (${releases.length} releases, ${html.length} bytes)`
    );
  } else {
    console.log(`${target} unchanged (${releases.length} releases)`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
