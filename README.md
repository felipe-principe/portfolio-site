# Portfólio · Felipe Principe

Site-portfólio de BI: os dashboards contados como cases, com a pergunta de negócio no topo e a parte técnica (modelo, DAX, SQL) embaixo.

## Destaques

- **Abertura com dados reais da base:** milhares de partículas se organizam no gráfico de volume mensal da Central de Atendimento.
- **Vista explodida do dashboard:** os visuais do Power BI flutuam em camadas 3D e se encaixam com a rolagem, a partir das posições reais do arquivo `.pbip`.
- **Página de case com navegação por capítulos** e acesso permanente ao dashboard interativo.
- **Consultas SQL** com o resultado real de cada uma, geradas por script a partir dos CSVs.
- **Desempenho:** Lighthouse 96–98 em desempenho e 100 em acessibilidade, boas práticas e SEO (celular).

## Stack

[Astro 7](https://astro.build) (HTML estático) · TypeScript · CSS próprio · [GSAP](https://gsap.com) (ScrollTrigger, SplitText) · [Lenis](https://lenis.darkroom.engineering) · Construído com Claude Code.

## Rodar localmente

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # gera o site estático em dist/
```

## Onde fica cada coisa

| Caminho | Conteúdo |
|---|---|
| `src/content/cases/*.md` | Texto e dados de cada case (um arquivo por dashboard) |
| `src/components/home/` | Seções da home (abertura, vista explodida, vitrine, sobre) |
| `src/components/case/` | Blocos da página de case (tour, SQL, modelo, capítulos) |
| `src/i18n/ui.ts` | Textos fixos em português e inglês, e links de contato |
| `src/data/` | Números dos gráficos e resultados das consultas, gerados por script |
| `scripts/gerar-dados.mjs` | Lê os CSVs e gera `src/data/central-atendimento.json` |
| `sql/` | Modelo em SQL e consultas; `node rodar.mjs` gera `src/data/sql.json` |

## Publicar

Conectado à [Vercel](https://vercel.com): cada push na branch `main` publica o site automaticamente. Configuração padrão de Astro (build `npm run build`, saída `dist/`).
