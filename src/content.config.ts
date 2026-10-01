import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Um arquivo .md por case em src/content/cases. Todo o texto e os dados ficam no frontmatter;
// o layout é fixo em src/pages/projetos/[slug].astro, então um case novo não mexe em código.
const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      order: z.number(),
      status: z.enum(['publicado', 'em-producao']),
      summary: z.string(),
      // selo mostrado perto dos números do dashboard
      dataLabel: z.string().default('base fictícia'),
      // destaque curto no card da vitrine (ex.: "Usado na operação")
      badge: z.string().optional(),
      result: z.string().optional(),
      cover: image().optional(),
      video: z.string().optional(),
      poster: z.string().optional(),
      tools: z.array(z.string()).default([]),
      facts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      pbiUrl: z.string().url().optional(),
      repoUrl: z.string().optional(),
      problem: z.string().optional(),
      questions: z.array(z.object({ page: z.string(), q: z.string() })).default([]),
      tour: z
        .array(z.object({ page: z.string(), image: image(), text: z.string(), look: z.string().optional(), pageId: z.string().optional() }))
        .default([]),
      insight: z.object({ tag: z.string(), title: z.string(), text: z.string(), chart: z.string().optional() }).optional(),
      model: z
        .object({
          title: z.string().default('O modelo por trás.'),
          text: z.string(),
          steps: z.array(z.string()).default([]),
          relations: z.array(z.tuple([z.string(), z.string()])).default([]),
          // ordem das dimensões nas colunas do diagrama (evita linhas cruzadas)
          layout: z.object({ left: z.array(z.string()), right: z.array(z.string()) }).optional(),
        })
        .optional(),
      // mostra a seção "Consultas SQL" (sql/consultas + src/data/sql.json)
      sql: z.boolean().default(false),
      dax: z.array(z.object({ name: z.string(), why: z.string(), code: z.string() })).default([]),
      design: z.array(z.object({ h: z.string(), p: z.string() })).default([]),
      learnings: z.object({ real: z.string(), next: z.string() }).optional(),
      // apresentação gerada a partir do dashboard (card discreto no fim do case)
      deck: z.object({ title: z.string(), text: z.string(), href: z.string(), image: image() }).optional(),
    }),
});

export const collections = { cases };
