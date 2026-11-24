#!/usr/bin/env node
/**
 * render-releases.mjs
 *
 * Writes `src/data/releases.json` from the GitHub Releases API (D6 in
 * docs/documentation.md): the JSON is committed back to the repo and the
 * Astro build uses it to render both download pages, so visitors never
 * execute JavaScript and the site stays a plain static build. No `.sig`
 * files are ever included. Release notes stay in their original German.
 *
 * Dependencies: none. Only Node >= 18 (global fetch) and the filesystem.
 *
 * Environment:
 *   RELEASES_REPO   owner/repo to read releases from
 *                   (default: Wurzelpeter137/Amp-Nerd-Releases, so that the
 *                   fork's preview renders the same content as upstream)
 *   GITHUB_TOKEN    optional; raises the API rate limit
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPO =
  process.env.RELEASES_REPO || "Wurzelpeter137/Amp-Nerd-Releases";

/**
 * Keep only the fields the Astro download pages use (and drop `.sig`
 * assets) so the file stays small and the signature files can never leak
 * into the rendered HTML.
 */
function shapeReleases(releases) {
  const dropSig = (a) => !/\.sig$/i.test(a.name);
  return releases
    .map((r) => ({
      name: r.name ?? r.tag_name,
      tag_name: r.tag_name,
      published_at: r.published_at,
      body: r.body ?? "",
      html_url: r.html_url,
      assets: (r.assets ?? []).filter(dropSig).map((a) => ({
        name: a.name,
        browser_download_url: a.browser_download_url,
        size: a.size,
      })),
    }))
    .sort((a, b) => (a.published_at < b.published_at ? 1 : -1));
}

async function main() {
  const headers = {
    "User-Agent": "amp-nerd-releases-renderer",
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const url = `https://api.github.com/repos/${REPO}/releases?per_page=30`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  }
  const releases = shapeReleases(await res.json());

  // Plain JSON only (no leading comment): Astro/Vite imports this as JSON
  // and strict JSON.parse rejects comments.
  const json = JSON.stringify(releases, null, 2) + "\n";
  const dir = join(ROOT, "src", "data");
  mkdirSync(dir, { recursive: true });
  const target = join(dir, "releases.json");
  const previous = (() => {
    try {
      return readFileSync(target, "utf8");
    } catch {
      return null;
    }
  })();

  writeFileSync(target, json);
  if (previous === null || previous !== json) {
    console.log(
      `wrote ${target} (${releases.length} releases, ${json.length} bytes)`
    );
  } else {
    console.log(`${target} unchanged (${releases.length} releases)`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
