// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  // Endereço público (SEO e Open Graph). Trocar se um dia houver domínio próprio.
  site: 'https://felipe-principe.vercel.app',
  integrations: [mdx()],
  // CSS dentro do HTML: sem requisição bloqueando a primeira pintura.
  build: { inlineStylesheets: 'always' },
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
