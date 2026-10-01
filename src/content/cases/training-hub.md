---
# ======================================================================
# Case: Training Performance Analytics Hub
# Meu primeiro dashboard, construído sozinho (antes das ferramentas de IA) e usado na rotina de T&D.
# Versão de portfólio: base fictícia que preserva o formato das curvas da operação real
# (pasta "T&D Streaming CX (dados ficticios)"). Nenhum número, nome ou comentário real.
# ======================================================================
title: Training Performance Analytics Hub
order: 2
status: publicado
summary: Do treinamento à operação — como cada turma de New Hires evolui em PE, IR e qualidade, do nesting aos 90 dias.
result: A curva de aprendizado de cada turma, na mesma régua da operação.
dataLabel: base fictícia
badge: Usado na operação
cover: ../../assets/cases/training-hub/01-visao-operacional.png
video: /videos/02-ramp-up-agentes.mp4
poster: /videos/02-ramp-up-agentes-poster.jpg
tools: [Power BI, DAX, Power Query, Salesforce]
facts:
  - { label: Ferramenta, value: Power BI }
  - { label: Páginas, value: '3 + capa' }
  - { label: Volume, value: '188 mil casos · 9 turmas' }
  - { label: Período, value: 'Jan–Nov 2025' }
  - { label: Papel, value: 'Do zero, sozinho, antes da IA' }
pbiUrl: https://app.powerbi.com/view?r=eyJrIjoiNDM5ZThiYWMtYTVlYS00ZWM5LWEzY2EtMTgyYmY3N2FkM2YzIiwidCI6ImJmYTcyOWViLWFhYTQtNDAyYS1iYzY0LWE1MzlkNGI5NTY1NyJ9
repoUrl: https://github.com/felipe-principe/training-performance-hub

problem: >-
  Como líder educador, eu precisava responder toda semana se as turmas de New Hires e as ações de reciclagem
  estavam funcionando. Os dados vinham de exportações do Salesforce e do Tableau para Excel e CSV: pesquisa de
  satisfação, notas de qualidade e datas de cada turma em arquivos separados, cruzados à mão com tabela dinâmica.
  Foi aí que o dado virou a minha ferramenta principal, e este dashboard nasceu para acabar com esse retrabalho:
  cada novato na mesma régua da operação, fase por fase.

questions:
  - { page: Visão Operacional, q: 'Como a operação está entregando?' }
  - { page: Ramp-up New Hire, q: 'Como cada novato evolui do nesting aos 90 dias?' }
  - { page: Comparativo de Turmas, q: 'Qual turma chegou mais rápido na meta?' }

tour:
  - page: Visão Operacional
    pageId: 738c87289c70e3be0017
    image: ../../assets/cases/training-hub/01-visao-operacional.png
    text: A régua da operação. PE e IR contra as metas, volume por canal semana a semana e os principais motivos de contato, com filtro por tipo de atendimento e gestor.
    look: Em setembro e outubro, o IR fica em 90,0%, acima da meta de 89%, mas o PE para em 94,75%, logo abaixo dos 95%. Setup My Service e Plans, Signup and Billing concentram os contatos.
  - page: Ramp-up New Hire
    pageId: 8d5988e6031d1e68d0b3
    image: ../../assets/cases/training-hub/02-ramp-up.png
    text: A página da turma. Datas de treinamento, nesting e go-live, headcount, T-SAT e prova final, PE, IR e QC por agente e a curva de cada indicador por fase.
    look: Na turma 5, o IR começa em 82,7% no nesting e chega a 92,3% aos 60 dias, enquanto o QC oscila — é aí que entra o coaching.
  - page: Comparativo de Turmas
    pageId: 7a81c965a15068115112
    image: ../../assets/cases/training-hub/03-comparativo.png
    text: Turma contra turma. PE, IR e QC de cada turma ao longo do ramp-up, contra uma meta que sobe a cada fase.
    look: A linha pontilhada é a meta escalonada (PE de 90% no nesting até 95% aos 90 dias). Dá para ver qual turma chegou antes na régua da operação.

insight:
  tag: O insight
  title: O ramp-up não é uma linha reta.
  text: >-
    Comparar novatos com a meta cheia da operação desde o primeiro dia só gera alarme falso. Com metas
    escalonadas por fase, o dashboard separa quem está no ritmo esperado de quem precisa de coaching, e mostra
    em que fase cada turma costuma travar. A conversa com a gerência deixou de ser "a turma está abaixo da meta"
    e passou a ser "a turma está no ritmo, e estes três agentes precisam de apoio agora".

model:
  title: Três bases, uma régua de ramp-up.
  text: >-
    Casos do Salesforce (pesquisa PE/IR, canal e motivo), avaliações de qualidade e a base de New Hires
    (turma e datas de cada fase). O e-mail do agente liga casos e QA à turma, e cada atendimento recebe
    em DAX o seu período de ramp-up, com a meta daquela fase.
  steps:
    - Na operação, três exportações (Salesforce e planilhas de QA e de turmas) tratadas no Power Query. Na versão de portfólio, uma base fictícia em 3 CSVs que preserva o formato das curvas reais, com nomes, números e comentários trocados.
    - Coluna calculada PeriodoNH que conta os dias desde o go-live de cada agente e classifica o atendimento em Nesting, 30, 60, 90 ou 90+.
    - Metas escalonadas por fase para PE, IR e QC (por exemplo, IR de 83% no nesting até 90% aos 90 dias).
    - Tabela calculada com TOPN para os seis principais motivos de contato.
  relations: []

dax:
  - name: PeriodoNH (coluna calculada)
    why: A peça central do modelo. Cada atendimento é posicionado na jornada do agente que atendeu, a partir das datas de nesting e go-live da base de New Hires. É isso que permite comparar turmas diferentes no mesmo eixo.
    code: |-
      PeriodoNH =
      VAR Agente = 'Base cases'[Case Owner Email]
      VAR DataAtendimento = 'Base cases'[Date]
      VAR DataInicioNesting =
          CALCULATE ( MAX ( 'BASE NH'[Inicio Nesting] ), FILTER ( 'BASE NH', 'BASE NH'[User Email] = Agente ) )
      VAR DataGoLive =
          CALCULATE ( MAX ( 'BASE NH'[GO LIVE] ), FILTER ( 'BASE NH', 'BASE NH'[User Email] = Agente ) )
      VAR DiasPosGoLive = DATEDIFF ( DataGoLive, DataAtendimento, DAY )
      RETURN
          IF (
              ISBLANK ( DataGoLive ), BLANK (),
              SWITCH (
                  TRUE (),
                  DataAtendimento >= DataInicioNesting && DataAtendimento < DataGoLive, "Nesting",
                  DiasPosGoLive <= 30, "30",
                  DiasPosGoLive <= 60, "60",
                  DiasPosGoLive <= 90, "90",
                  "90+"
              )
          )
  - name: PE NH Target (meta escalonada)
    why: Novato não é cobrado pela meta cheia no primeiro dia. A meta acompanha a fase do ramp-up, do mesmo jeito que a gente conduzia o coaching na vida real.
    code: |-
      PE NH Target =
      SWITCH (
          TRUE (),
          'Base cases'[PeriodoNH] = "Nesting", 0.90,
          'Base cases'[PeriodoNH] = "30", 0.92,
          'Base cases'[PeriodoNH] = "60", 0.935,
          'Base cases'[PeriodoNH] = "90", 0.95,
          'Base cases'[PeriodoNH] = "90+", 0.95
      )
  - name: IR por turma — v1 e como eu faria hoje
    why: Meu primeiro dashboard tinha uma medida por turma (27 no total, somando PE, IR e QC). Hoje eu escreveria uma medida por indicador e colocaria a turma na legenda. O modelo fica menor e uma turma nova não exige medida nova.
    code: |-
      -- v1: uma medida para cada turma (T01 … T09)
      IR T01 =
      CALCULATE ( COUNT ( 'Base cases'[Resolved?] ), 'Base cases'[Resolved?] = "yes", FILTER ( 'BASE NH', 'BASE NH'[TURMA] = 1 ) )
          / CALCULATE ( COUNT ( 'Base cases'[Resolved?] ), 'Base cases'[Resolved?] <> BLANK (), FILTER ( 'BASE NH', 'BASE NH'[TURMA] = 1 ) )

      -- v2: uma medida só, com 'BASE NH'[TURMA] na legenda do gráfico
      IR =
      DIVIDE (
          CALCULATE ( COUNTROWS ( 'Base cases' ), 'Base cases'[Resolved?] = "yes" ),
          CALCULATE ( COUNTROWS ( 'Base cases' ), NOT ISBLANK ( 'Base cases'[Resolved?] ) )
      )

design:
  - h: Uma cor por indicador
    p: Azul é PE, roxo é IR e dourado é QC, nos anéis, nas barras e nas linhas. A mesma leitura em todas as páginas.
  - h: Capa com três portas
    p: Performance, Training e Class Comparison. Quem abre escolhe a pergunta antes de ver o primeiro gráfico.
  - h: Página longa da turma
    p: Filtros e dados da turma à esquerda, desempenho à direita. A página segue a ordem da conversa de acompanhamento com a gerência.
  - h: Identidade própria
    p: O tema espacial separa o hub de treinamento dos painéis da operação, sem perder a paleta de indicadores.

learnings:
  real: >-
    Meu primeiro dashboard, construído do zero enquanto eu estudava Power BI e DAX, sem IA no processo. Virou a
    base das apresentações de resultado com a gerência: acompanhar cada turma do nesting aos 90 dias, provar se as
    ações de treinamento e reciclagem funcionaram e decidir quem precisava de coaching.
  next: >-
    Uma medida por indicador com a turma na legenda, no lugar de 27 medidas. Tabela calendário própria no lugar
    das datas automáticas do Power BI. Metas numa tabela, não fixas no código. E tirar o "(Em branco)" da lista de motivos.
---
