---
# ======================================================================
# Case: Central de Atendimento
# Tudo que aparece na página do case vem daqui. Editar o texto aqui muda o site.
# Projeto autoral de portfólio: base fictícia, modelada a partir dos KPIs reais de uma operação de streaming.
# ======================================================================
title: Central de Atendimento
order: 1
status: publicado
badge: Projeto autoral
summary: Dashboard operacional de 4 páginas que lê um ano de atendimento em quatro perguntas.
result: Um ano de operação lido em quatro perguntas.
cover: ../../assets/cases/central-atendimento/01-visao-geral.png
video: /videos/01-visao-geral-canais.mp4
poster: /videos/01-visao-geral-canais-poster.jpg
tools: [Power BI, DAX, Power Query, Modelagem dimensional]
facts:
  - { label: Ferramenta, value: Power BI }
  - { label: Páginas, value: '4 + capa' }
  - { label: Volume, value: '141.431 chamados' }
  - { label: Período, value: 'Jan–Dez 2025' }
  - { label: Papel, value: 'Base, modelo, DAX e design' }
pbiUrl: https://app.powerbi.com/view?r=eyJrIjoiNmZmZTk1NDAtNzIyNC00MTljLWE3ZmMtYzdlNTc3NGRmNDJiIiwidCI6ImJmYTcyOWViLWFhYTQtNDAyYS1iYzY0LWE1MzlkNGI5NTY1NyJ9&pageName=305de39e52d0493bf5d9
repoUrl: https://github.com/felipe-principe/dashboard-central-atendimento
sql: true
deck:
  title: Fechamento 2025
  text: O mesmo modelo virou uma apresentação de fechamento do ano, gerada com IA (Claude Code). É o primeiro passo de um report automático que chega por e-mail.
  href: /apresentacoes/fechamento-2025.html
  image: ../../assets/cases/central-atendimento/fechamento-junho.png

problem: >-
  Em sete anos de operação, vi a mesma cena em toda reunião de resultado: o volume vinha de um relatório,
  o SLA de outro, a pesquisa de satisfação de um terceiro e a escala de uma planilha do WFM. Quando o SLA
  caía, cada área defendia o seu pedaço e a conversa virava opinião. Este projeto é o painel que eu queria
  ter nessas reuniões: um modelo só, com sintoma e causa na mesma tela.

questions:
  - { page: Visão Geral, q: 'Como foi o período, em uma olhada?' }
  - { page: CSAT e SLA, q: 'Como o cliente viveu esse atendimento?' }
  - { page: Equipes, q: 'Quem entregou o resultado?' }
  - { page: WFM, q: 'Tínhamos gente em linha para sustentar?' }

tour:
  - page: Visão Geral
    pageId: 82b1900583a98250a414
    image: ../../assets/cases/central-atendimento/01-visao-geral.png
    text: O retrato do período. Cinco KPIs com variação em p.p. contra o mês anterior, volume por canal e as tendências de SLA e absenteísmo lado a lado.
    look: Junho salta no volume enquanto o SLA afunda e o ABS dispara. A pergunta das 9h aparece sozinha.
  - page: CSAT e SLA
    pageId: b2bd0d495f00a9f03cec
    image: ../../assets/cases/central-atendimento/02-csat-sla.png
    text: O diagnóstico da experiência. Canais, motivos de contato, reabertura e casos pendentes, com Positive Experience e Issue Resolution contra as metas.
    look: O SLA não falha por igual. Setup My Service tem quase o volume de Plans, Signup and Billing e entrega 84,1% contra 79,9%.
  - page: Equipes
    pageId: 6026c558ea248c34d73e
    image: ../../assets/cases/central-atendimento/03-equipes.png
    text: Quem gera o resultado. Desempenho por equipe, por turno e por hora do dia, na mesma régua de KPIs.
    look: Quanto maior o TMA, menor a satisfação. As duas equipes com pior TMA e SLA são as únicas que estouram a meta de ABS.
  - page: WFM
    pageId: 4a992778423429af5194
    image: ../../assets/cases/central-atendimento/04-wfm.png
    text: Capacidade. Nível de serviço, aderência, espera e abandono, com o mapa de calor de demanda e serviço hora a hora.
    look: Quem desiste espera ~114 s contra ~27 s de quem é atendido. Em junho, com ABS em 5,81%, o serviço desabou para 61,6%.

insight:
  tag: O insight
  title: Junho não foi azar. Faltou gente na linha.
  text: >-
    O volume de junho ficou 35% acima da média do ano. No mesmo mês, o absenteísmo passou da meta de 4%
    e o SLA caiu de ~82% para 76,9%. Nenhum dos três números, sozinho, explica o problema.
    Lidos juntos, contam a história: demanda alta com equipe desfalcada. E o mapa de calor da página WFM mostra
    o horário mais frágil da operação: das 18h às 20h.
  chart: volume-sla-abs

model:
  title: Três fatos, seis dimensões, um modelo.
  text: >-
    Modelo estrela com três tabelas fato, cada uma no seu grão (chamado, abandono e dia de escala de cada agente),
    e seis dimensões compartilhadas. A data e o canal filtram as três fatos ao mesmo tempo, o que permite cruzar
    satisfação, fila e escala no mesmo visual.
  steps:
    - "Base fictícia de 141 mil chamados em 8 CSVs, desenhada a partir dos KPIs e metas que acompanho na operação: sazonalidade, turnos, metas por canal, pesquisa de satisfação e um incidente planejado em junho para testar a narrativa."
    - Power Query com um parâmetro de pasta (Caminho_Base) — o projeto muda de máquina sem editar as consultas.
    - Tipagem, colunas de data e hora derivadas e tabela de horas para o mapa de calor.
    - ~50 medidas DAX em pastas (volume, qualidade, WFM, backlog, comparação temporal, metas), cada uma documentada.
  relations:
    - [Fato_Chamados, Dim_Data]
    - [Fato_Chamados, Dim_Cliente]
    - [Fato_Chamados, Dim_Agente]
    - [Fato_Chamados, Dim_Canal]
    - [Fato_Chamados, Dim_Motivo_Contato]
    - [Fato_Chamados, Dim_Hora]
    - [Fato_Abandonos, Dim_Data]
    - [Fato_Abandonos, Dim_Canal]
    - [Fato_Abandonos, Dim_Hora]
    - [Fato_Escala, Dim_Data]
    - [Fato_Escala, Dim_Agente]
  layout:
    left: [Dim_Cliente, Dim_Motivo_Contato, Dim_Agente]
    right: [Dim_Canal, Dim_Data, Dim_Hora]

dax:
  - name: Var. SLA vs Mês Anterior (p.p.)
    why: Diferença em pontos percentuais, não variação relativa. Para um indicador que já é percentual, a subtração é o que se lê num cartão de KPI. O IF evita mostrar variação no primeiro mês, que não tem anterior.
    code: |-
      Var. SLA vs Mês Anterior (p.p.) =
      IF (
          NOT ISBLANK ( [% SLA Mês Anterior] ),
          [% SLA Cumprido] - [% SLA Mês Anterior]
      )
  - name: Meta Nível de Serviço
    why: A meta vem da Dim_Canal, não fica fixa no código. Chat e telefone têm tempos de espera diferentes (30 s e 45 s) com o mesmo alvo de 80%, e a meta acompanha o filtro de canal.
    code: |-
      Meta Nível de Serviço =
      DIVIDE (
          AVERAGE ( Dim_Canal[Meta_Nivel_Servico_Pct] ),
          100
      )
  - name: Idade Média dos Casos Pendentes
    why: A referência é a última data com dados, não TODAY(). Com base histórica, TODAY() faria a idade dos casos crescer todo dia sem nada mudar na operação.
    code: |-
      Idade Média dos Casos Pendentes =
      VAR Ref = [Última Data com Dados]
      RETURN
          AVERAGEX (
              FILTER ( Fato_Chamados, Fato_Chamados[Status_Caso] <> "Encerrado" ),
              DATEDIFF ( Fato_Chamados[Data], Ref, DAY )
          )

design:
  - h: Tema escuro, azul-noite
    p: Pensado para telão de reunião e para longas horas de tela. O fundo some e os números aparecem.
  - h: Uma cor por métrica
    p: Azul é Positive Experience, roxo é Issue Resolution, verde é SLA, rosa é absenteísmo, em todas as páginas. Quem aprende a cor uma vez lê o dashboard inteiro.
  - h: Navegação lateral e capa
    p: Quatro páginas, quatro perguntas, sempre no mesmo lugar. A capa explica o que cada página responde antes do primeiro clique.
  - h: Rodapé que conclui
    p: Cada página termina com uma frase de leitura. O dashboard não só mostra, ele diz o que viu.

learnings:
  real: >-
    Projeto autoral, construído para o portfólio. Não foi implantado porque BI é outra área da empresa, com acessos
    e sistemas próprios, e minha função hoje é Treinamento. Mas ele nasceu da operação que eu vivo: Positive
    Experience, Issue Resolution, SLA, absenteísmo e aderência são os números que eu acompanho nas reuniões de
    resultado. Foi desenvolvido com Claude Code no fluxo, da geração da base à documentação das medidas.
  next: >-
    Ligar o modelo a um banco SQL com atualização agendada. Trocar o filtro de mês único da página Equipes por
    ano completo com o mês destacado. E fechar o ciclo com automação: um resumo semanal montado em HTML a partir
    do modelo e enviado por e-mail para a liderança, sem ninguém precisar abrir o dashboard.
---
