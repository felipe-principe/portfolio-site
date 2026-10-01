// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  // Trocar pelo domínio definitivo quando for registrado (usado em SEO e Open Graph).
  site: 'https://felipeprincipe.com.br',
  integrations: [mdx()],
  // CSS dentro do HTML: sem requisição bloqueando a primeira pintura.
  build: { inlineStylesheets: 'always' },
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
