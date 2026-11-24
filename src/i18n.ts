/**
 * i18n — locales, chrome strings (nav, footer) and page meta (title, description).
 *
 * D3/D11 in docs/documentation.md: German is the default locale, both
 * locales are fully translated. Release notes stay in their original
 * German on both locales; all site chrome is translated here.
 */

export type Locale = "de" | "en";

export const LOCALES: Locale[] = ["de", "en"];
export const DEFAULT_LOCALE: Locale = "de";

export const UPSTREAM = "https://github.com/Wurzelpeter137/Amp-Nerd-Releases";
export const UPSTREAM_REPO = "Wurzelpeter137/Amp-Nerd-Releases";
export const UPSTREAM_RELEASES = `${UPSTREAM}/releases`;
export const UPSTREAM_ISSUES = `${UPSTREAM}/issues`;

export interface NavItem {
  label: string;
  href: string;
}

export interface Footer {
  links: NavItem[];
  note: string;
  copyright: string;
}

/** Navigation labels, per locale (hrefs filled with the locale prefix). */
const NAV: Record<Locale, Omit<NavItem, "href">[]> = {
  de: [
    { label: "Start" },
    { label: "Funktionen" },
    { label: "Modelle" },
    { label: "Download" },
  ],
  en: [
    { label: "Home" },
    { label: "Features" },
    { label: "Models" },
    { label: "Download" },
  ],
};

export function nav(locale: Locale): NavItem[] {
  const base = `/${locale}/`;
  const paths = ["", "features/", "models/", "download/"];
  return NAV[locale].map((item, i) => ({
    label: item.label,
    href: base + paths[i],
  }));
}

const FOOTER_NOTE: Record<Locale, string> = {
  de: `Die Simulation ersetzt keine Arbeit an echten Röhrenverstärkern – dort liegen
    lebensgefährliche Spannungen an. Marshall, JCM800, JTM45, Silver Jubilee und weitere
    genannte Namen sind Marken ihrer jeweiligen Inhaber; das Projekt steht in keiner
    Verbindung zu ihnen, die Namen beschreiben nur die nachgebauten Schaltungen.
    Dieses Repository enthält nur die Installer; der Quellcode ist nicht öffentlich.`,
  en: `This simulation is no substitute for working on real tube amplifiers – lethal
    voltages are present inside them. Marshall, JCM800, JTM45, Silver Jubilee and the
    other names mentioned are trademarks of their respective owners; this project is not
    affiliated with them, the names only describe the circuits that were reproduced.
    This repository contains installers only; the source code is not public.`,
};

export const FOOTER: Record<Locale, Footer> = {
  de: {
    links: [
      { label: "Download & Versionen", href: UPSTREAM_RELEASES },
      { label: "Feedback / Issues", href: UPSTREAM_ISSUES },
      { label: "Modelle", href: "/de/models/" },
      { label: "Funktionen", href: "/de/features/" },
    ],
    note: FOOTER_NOTE.de,
    copyright: "Amp Nerd · Wurzelpeter",
  },
  en: {
    links: [
      { label: "Downloads & versions", href: UPSTREAM_RELEASES },
      { label: "Feedback / issues", href: UPSTREAM_ISSUES },
      { label: "Models", href: "/en/models/" },
      { label: "Features", href: "/en/features/" },
    ],
    note: FOOTER_NOTE.en,
    copyright: "Amp Nerd · Wurzelpeter",
  },
};

/** Brand line under "Amp Nerd". */
export const BRAND_SUB: Record<Locale, string> = {
  de: "von Wurzelpeter",
  en: "by Wurzelpeter",
};

/** <title> and meta description per page, per locale. */
export type PageKey = "home" | "features" | "models" | "download" | "notfound";

export const META: Record<
  Locale,
  Record<PageKey, { title: string; description: string }>
> = {
  de: {
    home: {
      title: "Amp Nerd · Röhren-Gitarrenverstärker, Bauteil für Bauteil simuliert",
      description:
        "Amp Nerd simuliert komplette Röhren-Gitarrenverstärker als elektrisches Netzwerk: Marshall, Hiwatt, Fender, Dumble, Diezel, Mesa und mehr – Bauteil für Bauteil nachgebaut, jede Röhre tauschbar, jede Messung live. VST3 (Windows) und VST3/AU (macOS).",
    },
    features: {
      title: "Funktionen · Amp Nerd",
      description:
        "Schaltplan zum Anfassen, Röhren & Mods, Werkbank im Plugin: Messspitze, Oszilloskop, Frequenzgang – Amp Nerd liefert den Weg zum Klang.",
    },
    models: {
      title: "Modelle · Amp Nerd",
      description:
        "16+ Verstärker und 2 Pedale: Marshall, Hiwatt, Fender, Dumble, Diezel, Mesa – jede Schaltung als elektrisches Netzwerk nachgebaut.",
    },
    download: {
      title: "Download · Amp Nerd",
      description:
        "Amp Nerd herunterladen: VST3 für Windows, VST3 und AU für macOS – alle Versionen mit Change Log.",
    },
    notfound: {
      title: "Seite nicht gefunden · Amp Nerd",
      description: "Diese Seite existiert nicht.",
    },
  },
  en: {
    home: {
      title: "Amp Nerd · tube guitar amps simulated component by component",
      description:
        "Amp Nerd simulates complete tube guitar amplifiers as an electrical network: Marshall, Hiwatt, Fender, Dumble, Diezel, Mesa and more – rebuilt component by component, every tube swappable, every measurement live. VST3 (Windows) and VST3/AU (macOS).",
    },
    features: {
      title: "Features · Amp Nerd",
      description:
        "A schematic you can touch, tubes & mods, a workbench inside the plugin: probe, oscilloscope, frequency response – Amp Nerd delivers the path to the tone.",
    },
    models: {
      title: "Models · Amp Nerd",
      description:
        "16+ amplifiers and 2 pedals: Marshall, Hiwatt, Fender, Dumble, Diezel, Mesa – every circuit rebuilt as an electrical network.",
    },
    download: {
      title: "Download · Amp Nerd",
      description:
        "Download Amp Nerd: VST3 for Windows, VST3 and AU for macOS – all versions with a changelog.",
    },
    notfound: {
      title: "Page not found · Amp Nerd",
      description: "This page does not exist.",
    },
  },
};
