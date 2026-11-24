import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://wurzelpeter137.github.io/Amp-Nerd-Releases',
  // All internal URLs end with "/" so GitHub Pages maps them to the
  // generated <dir>/index.html files.
  trailingSlash: "always",
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
