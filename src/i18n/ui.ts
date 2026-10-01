// Textos fixos do site em PT e EN. Textos dos cases ficam em src/content/cases.
// [RASCUNHO] marca o que ainda precisa ser revisado pelo Felipe.

export const languages = { pt: 'PT', en: 'EN' } as const;
export type Lang = keyof typeof languages;

export const links = {
  email: 'felipelmprincipe@gmail.com',
  linkedin: 'https://www.linkedin.com/in/felipe-principe-731b7116a/',
  github: 'https://github.com/felipe-principe',
  cv: '/curriculo-felipe-principe.pdf', // [RASCUNHO] colocar o PDF atualizado em public/
};

export const ui = {
  pt: {
    meta: {
      title: 'Felipe Principe · Analista de BI',
      description: 'Portfólio de BI de Felipe Principe: dashboards em Power BI, SQL e DAX construídos por quem viveu 7+ anos dentro de operações de Customer Experience.',
    },
    nav: { projects: 'Projetos', about: 'Sobre', cv: 'Currículo', skip: 'Pular para o conteúdo' },
    hero: {
      eyebrow: 'Felipe Principe · Analista de BI',
      title: ['Dashboards que viram ', 'decisão.'],
      ledeStrong: '7+ anos dentro de operações de Customer Experience.',
      lede: 'Power BI, SQL e DAX, acelerados por IA e automação, construídos por quem já esteve do outro lado da métrica.',
      ctaCase: 'Ver o case em destaque',
      ctaCv: 'Currículo (PDF)',
      chartTag: 'Central de Atendimento · 2025 ·',
      fict: 'base fictícia',
      counterSub: 'chamados. Uma decisão.',
      unit: ['1 ponto ≈', 'chamados'],
      avg: 'média mensal',
      calls: 'chamados',
      vsAvg: 'vs média',
      scroll: 'Role',
      chartLabel: 'Gráfico de volume mensal de chamados em 2025: pico em junho, com 15.856 chamados, contra média mensal de 11.786.',
    },
    featured: {
      tag: 'Case em destaque',
      title: 'Um ano de operação, lido em quatro perguntas.',
      meta: 'Power BI · 4 páginas · 141.431 chamados · 3 fatos e 6 dimensões',
      planeLabel: 'Página Visão Geral do dashboard Central de Atendimento: cinco indicadores no topo, volume por canal mês a mês e gráficos de SLA e absenteísmo.',
      steps: [
        { n: '01 · O retrato', h: 'Cinco KPIs, uma linha.', p: 'Cada card traz a variação em p.p. contra o mês anterior. A leitura das 9h da manhã cabe numa olhada.' },
        { n: '02 · O sintoma', h: 'Junho salta.', p: '15.856 chamados, 35% acima da média do ano. Algo aconteceu, e o gráfico não deixa passar.' },
        { n: '03 · A pista', h: 'Faltou gente na linha.', p: 'No mesmo mês o absenteísmo estoura a meta e o SLA cai para 76,9%. A página WFM mostra a causa hora a hora.' },
      ],
      ctaCase: 'Ver o case completo',
      ctaLive: 'Abrir dashboard interativo',
    },
    showcase: {
      tag: 'Projetos',
      title: 'Dashboards feitos para a reunião das 9h.',
      lede: 'Cada projeto começa com uma pergunta de negócio e termina numa decisão. Passe o mouse para ver o dashboard em uso.',
      view: 'Ver case',
      soon: 'Em produção',
      next: 'Próximo case',
    },
    how: {
      tag: 'Como eu trabalho',
      title: 'Da pergunta à decisão, com IA no fluxo.',
      lede: 'Anos à frente de turmas, KPIs e planos de ação me ensinaram qual pergunta o gestor faz primeiro. O resto é método.',
      steps: [
        { k: '01', h: 'A pergunta', p: 'Começo pelo que a liderança precisa decidir, não pelo gráfico. Uma pergunta por página.' },
        { k: '02', h: 'O dado', p: 'Modelagem em estrela, Power Query e SQL para uma base confiável, com cada medida DAX documentada.' },
        { k: '03', h: 'A leitura', p: 'Hierarquia visual, uma cor por métrica e anotações que apontam o que olhar. Design pensado, não decorado.' },
        { k: '04', h: 'IA e automação', p: 'Com Claude Code e n8n, o relatório se monta e chega sozinho: resumo diário, semanal ou mensal em HTML, direto no e-mail da liderança. Menos rotina, mais análise.' },
      ],
      badge: 'Este site foi construído com Claude Code.',
    },
    about: {
      tag: 'Sobre',
      title: 'Do atendimento ao dado.',
      p1: 'Comecei atendendo clientes internacionais, virei educador, supervisor e líder de treinamento. Em cada etapa, a pergunta era a mesma: o que os números estão dizendo sobre as pessoas?',
      p2: 'Foi analisando turmas e ações de reciclagem, com bases do Salesforce e do Tableau no Excel, que o dado virou a minha ferramenta principal. Hoje somo Power BI, SQL e IA a essa vivência, curso Big Data e Inteligência Analítica e conduzo reuniões em inglês com stakeholders globais.',
      more: 'Mais sobre mim',
      career: 'Trajetória',
      roles: [
        { y: '2018', r: 'Atendimento internacional' },
        { y: '2018', r: 'Suporte especializado' },
        { y: '2019', r: 'Líder educador' },
        { y: '2019', r: 'Supervisor de atendimento' },
        { y: '2021', r: 'Líder educador bilíngue' },
        { y: 'Hoje', r: 'BI, dados e IA' },
      ],
    },
    footer: {
      title: 'Vamos conversar?',
      lede: 'Aberto a vagas de Analista de BI e Analista de Dados, presenciais em São Paulo ou remotas.',
      email: 'E-mail',
      built: 'Site construído com Claude Code · Astro · GSAP',
      rights: 'Dados de dashboards: bases fictícias criadas para portfólio.',
    },
    modal: { tag: 'Dashboard interativo', close: 'Fechar' },
  },
  en: {
    meta: {
      title: 'Felipe Principe · BI Analyst',
      description: 'BI portfolio of Felipe Principe: Power BI, SQL and DAX dashboards built by someone who spent 7+ years inside Customer Experience operations.',
    },
    nav: { projects: 'Projects', about: 'About', cv: 'Résumé', skip: 'Skip to content' },
    hero: {
      eyebrow: 'Felipe Principe · BI Analyst',
      title: ['Dashboards that drive ', 'decisions.'],
      ledeStrong: '7+ years inside Customer Experience operations.',
      lede: 'Power BI, SQL and DAX, accelerated by AI and automation, built by someone who has been on the other side of the metric.',
      ctaCase: 'See the featured case',
      ctaCv: 'Résumé (PDF)',
      chartTag: 'Contact Center · 2025 ·',
      fict: 'fictional data',
      counterSub: 'tickets. One decision.',
      unit: ['1 dot ≈', 'tickets'],
      avg: 'monthly average',
      calls: 'tickets',
      vsAvg: 'vs average',
      scroll: 'Scroll',
      chartLabel: 'Monthly ticket volume in 2025: June peak of 15,856 tickets against a monthly average of 11,786.',
    },
    featured: {
      tag: 'Featured case',
      title: 'A year of operations, read in four questions.',
      meta: 'Power BI · 4 pages · 141,431 tickets · 3 facts and 6 dimensions',
      planeLabel: 'Overview page of the Contact Center dashboard: five KPIs, volume by channel per month, and SLA and absenteeism charts.',
      steps: [
        { n: '01 · The snapshot', h: 'Five KPIs, one line.', p: 'Each card shows the change in percentage points versus last month. The 9 a.m. read fits in one glance.' },
        { n: '02 · The symptom', h: 'June spikes.', p: '15,856 tickets, 35% above the yearly average. Something happened, and the chart makes it impossible to miss.' },
        { n: '03 · The clue', h: 'Not enough people online.', p: 'That same month absenteeism breaks its target and SLA drops to 76.9%. The WFM page shows the cause hour by hour.' },
      ],
      ctaCase: 'See the full case',
      ctaLive: 'Open interactive dashboard',
    },
    showcase: {
      tag: 'Projects',
      title: 'Dashboards built for the 9 a.m. meeting.',
      lede: 'Every project starts with a business question and ends in a decision. Hover to see the dashboard in use.',
      view: 'View case',
      soon: 'In progress',
      next: 'Next case',
    },
    how: {
      tag: 'How I work',
      title: 'From question to decision, with AI in the loop.',
      lede: 'Years leading classes, KPIs and action plans taught me which question a manager asks first. The rest is method.',
      steps: [
        { k: '01', h: 'The question', p: 'I start from what leadership needs to decide, not from the chart. One question per page.' },
        { k: '02', h: 'The data', p: 'Star-schema modeling, Power Query and SQL for a reliable base, with every DAX measure documented.' },
        { k: '03', h: 'The read', p: 'Visual hierarchy, one color per metric and annotations that point at what matters. Designed, not decorated.' },
        { k: '04', h: 'AI and automation', p: 'With Claude Code and n8n, the report builds and delivers itself: daily, weekly or monthly HTML summaries straight to leadership inboxes. Less routine, more analysis.' },
      ],
      badge: 'This site was built with Claude Code.',
    },
    about: {
      tag: 'About',
      title: 'From the front line to the data.',
      p1: 'I started supporting international customers, then became a trainer, a supervisor and a training lead. At every step the question was the same: what are the numbers saying about the people?',
      p2: 'Analyzing training classes and refresher programs, with Salesforce and Tableau data in Excel, is how data became my main tool. Today I add Power BI, SQL and AI to that experience, study Big Data and Analytics, and run meetings in English with global stakeholders.',
      more: 'More about me',
      career: 'Career',
      roles: [
        { y: '2018', r: 'International support' },
        { y: '2018', r: 'Specialized support' },
        { y: '2019', r: 'Training lead' },
        { y: '2019', r: 'Support supervisor' },
        { y: '2021', r: 'Bilingual training lead' },
        { y: 'Now', r: 'BI, data and AI' },
      ],
    },
    footer: {
      title: "Let's talk?",
      lede: 'Open to BI Analyst and Data Analyst roles, on-site in São Paulo or remote.',
      email: 'Email',
      built: 'Built with Claude Code · Astro · GSAP',
      rights: 'Dashboard data: fictional datasets created for this portfolio.',
    },
    modal: { tag: 'Interactive dashboard', close: 'Close' },
  },
} as const;

export const t = (lang: Lang) => ui[lang];
export const localePath = (lang: Lang, path: string) => (lang === 'pt' ? path : `/en${path}`);
