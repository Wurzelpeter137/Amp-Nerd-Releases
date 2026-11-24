/**
 * download — page copy for the download pages, both locales.
 *
 * Static site text only (hero, install notes, note box, lead-ins, buttons,
 * fallbacks). The release list itself comes from src/data/releases.json,
 * and the German release notes stay on both locales (D3).
 *
 * The `dd` values are HTML strings (strong/code/em), rendered with set:html.
 */

import type { Locale } from "../i18n";

export interface InstallRow {
  dt: string;
  dd: string;
}

export interface DownloadCopy {
  kicker: string;
  h1: string;
  lead: string;
  emptyTitle: string;
  emptyBody: string;
  tabsAria: string;
  tabWin: string;
  tabMac: string;
  btnWin: string;
  btnMac: string;
  missingLabel: string;
  logH2: string;
  logLead: string;
  olderTitle: string;
  moreBtn: string;
  sourceLabel: string;
  installWin: InstallRow[];
  installMac: InstallRow[];
  noteCpu: string;
  noteInput: string;
}

const DE: DownloadCopy = {
  kicker: "Windows & macOS",
  h1: "Download",
  lead: `Die aktuellen Installer stehen pro Plattform in den <a href="{releases}" rel="noopener">GitHub-Releases</a> – unten direkt als Button, jeweils mit den Installationshinweisen für das eigene System. Darunter das komplette Change Log aller Versionen.`,
  emptyTitle: "Keine Releases gefunden",
  emptyBody: `Diese Seite wird automatisch aus den Releases des Repositories <a href="{releases}" rel="noopener">{repo}</a> erzeugt. Sobald ein Release veröffentlicht wurde, läuft der Workflow <code>render-releases</code> und erzeugt diese Seite neu.`,
  tabsAria: "Download nach Betriebssystem",
  tabWin: "Windows",
  tabMac: "macOS",
  btnWin: "Für Windows herunterladen",
  btnMac: "Für macOS herunterladen",
  missingLabel: "Aktuell nicht auffindbar – direkt bei den GitHub-Releases verfügbar.",
  logH2: "Change Log",
  logLead: `Alle Versionen direkt aus den <a href="{releases}" rel="noopener">GitHub-Releases</a> übernommen. Diese Seite wird automatisch erzeugt und bei jedem neuen Release aktualisiert; der Quellworkflow ist <a href="https://github.com/Wurzelpeter137/Amp-Nerd-Releases/blob/main/scripts/render-releases.mjs" rel="noopener">render-releases.mjs</a>.`,
  olderTitle: "Ältere Versionen",
  moreBtn: "Alle Releases auf GitHub",
  sourceLabel: "Details bei GitHub →",
  installWin: [
    { dt: "System", dd: "Windows 10/11, 64 Bit — CPU mit <strong>AVX2</strong> (Intel ab 4. Generation „Haswell“ 2013; AMD ab Ryzen)." },
    { dt: "Installationsort", dd: "<code>C:\\Program Files\\Common Files\\VST3\\Amp Nerd.vst3</code>" },
    { dt: "Erster Start", dd: "Nicht signiert — erscheint „Der Computer wurde durch Windows geschützt“: <em>Mehr erfahren &rarr; Trotzdem ausführen</em>. Deinstallation über <em>Einstellungen &rarr; Apps</em>." },
    { dt: "Wichtig", dd: "Den DAW-Host (Studio One, Cubase, Reaper …) <strong>vorher schließen</strong>, danach neu starten bzw. die Plugins neu scannen." },
  ],
  installMac: [
    { dt: "System", dd: "macOS 10.15+ — <strong>VST3 und Audio Unit</strong>, auf Apple Silicon und auf Intel." },
    { dt: "Installationsort", dd: "<code>/Library/Audio/Plug-Ins/VST3</code> und <code>/Library/Audio/Plug-Ins/Components</code>" },
    { dt: "Erster Start", dd: "Von Apple nicht attestiert — Rechtsklick auf die Datei &rarr; <em>Öffnen</em>, oder <em>Systemeinstellungen &rarr; Datenschutz &amp; Sicherheit &rarr; trotzdem öffnen</em>." },
    { dt: "Wichtig", dd: "Den DAW-Host (Logic, Studio One …) <strong>vorher schließen</strong>, danach neu starten bzw. die Plugins neu scannen." },
  ],
  noteCpu: `<strong>CPU-Last:</strong> je nach Modell ca. 40–55&nbsp;% eines CPU-Kerns bei „Normal 4x“; „Eco 2x“ braucht etwa die Hälfte, „Hoch 8x“ das Doppelte (gemessen auf einem aktuellen Desktop-Prozessor).`,
  noteInput: `<strong>Eingangspegel:</strong> die Eingangsanzeige im Plugin zeigt typische Single-Coil- und Humbucker-Bereiche. Liegt die Anschlagsspitze daneben, mit <strong>EINGANG dB</strong> abstimmen – sonst klingt jeder Verstärker zu sauber oder zu verzerrt.`,
};

const EN: DownloadCopy = {
  kicker: "Windows & macOS",
  h1: "Download",
  lead: `The current installers per platform live in the <a href="{releases}" rel="noopener">GitHub releases</a> – below as a button, each with the install notes for your own system. Beneath: the complete changelog of all versions.`,
  emptyTitle: "No releases found",
  emptyBody: `This page is generated automatically from the releases of the repository <a href="{releases}" rel="noopener">{repo}</a>. As soon as a release has been published, the <code>render-releases</code> workflow runs and regenerates this page.`,
  tabsAria: "Download by operating system",
  tabWin: "Windows",
  tabMac: "macOS",
  btnWin: "Download for Windows",
  btnMac: "Download for macOS",
  missingLabel: "Currently unavailable – see the GitHub releases directly.",
  logH2: "Changelog",
  logLead: `All versions taken directly from the <a href="{releases}" rel="noopener">GitHub releases</a>. This page is generated automatically and updated with every new release; the source workflow is <a href="https://github.com/Wurzelpeter137/Amp-Nerd-Releases/blob/main/scripts/render-releases.mjs" rel="noopener">render-releases.mjs</a>.`,
  olderTitle: "Older versions",
  moreBtn: "All releases on GitHub",
  sourceLabel: "Details on GitHub →",
  installWin: [
    { dt: "System", dd: "Windows 10/11, 64-bit — CPU with <strong>AVX2</strong> (Intel from 4th generation “Haswell”, 2013; AMD from Ryzen)." },
    { dt: "Install location", dd: "<code>C:\\Program Files\\Common Files\\VST3\\Amp Nerd.vst3</code>" },
    { dt: "First run", dd: "Not signed — if “Your PC was protected by Windows” appears: <em>More info &rarr; Run anyway</em>. Uninstall via <em>Settings &rarr; Apps</em>." },
    { dt: "Important", dd: "<strong>Close your DAW host</strong> (Studio One, Cubase, Reaper …) first, then restart it or rescan its plugins." },
  ],
  installMac: [
    { dt: "System", dd: "macOS 10.15+ — <strong>VST3 and Audio Unit</strong>, on Apple Silicon and on Intel." },
    { dt: "Install location", dd: "<code>/Library/Audio/Plug-Ins/VST3</code> and <code>/Library/Audio/Plug-Ins/Components</code>" },
    { dt: "First run", dd: "Not notarized by Apple — right-click the file and choose <em>Open</em>, or <em>System Settings &rarr; Privacy &amp; Security &rarr; Open Anyway</em>." },
    { dt: "Important", dd: "<strong>Close your DAW host</strong> (Logic, Studio One …) first, then restart it or rescan its plugins." },
  ],
  noteCpu: `<strong>CPU load:</strong> depending on the model roughly 40–55&nbsp;% of one CPU core at “Normal 4x”; “Eco 2x” needs about half that, “High 8x” twice as much (measured on a current desktop processor).`,
  noteInput: `<strong>Input level:</strong> the input meter in the plugin shows typical single-coil and humbucker ranges. If the peak lands off target, adjust it with <strong>INPUT dB</strong> – otherwise every amplifier will sound either too clean or too distorted.`,
};

export const DOWNLOAD_COPY: Record<Locale, DownloadCopy> = { de: DE, en: EN };

/** Fill the `{releases}` / `{repo}` placeholders with the live values. */
export function fill(template: string, releases: string, repo: string): string {
  return template.replaceAll("{releases}", releases).replaceAll("{repo}", repo);
}
