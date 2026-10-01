-- Nível: Fundamentos
-- Título: Visão geral do ano
-- Pergunta: Qual é o tamanho da operação no ano? Quantos chamados, quantos clientes e quanto dura um atendimento?
-- O que usa: COUNT, COUNT(DISTINCT), AVG, MIN e MAX.
-- Leitura: o retrato do ano numa linha; são os mesmos números dos cards da Visão Geral do dashboard.
SELECT
    COUNT(*)                         AS total_chamados,
    COUNT(DISTINCT id_cliente)       AS clientes_atendidos,
    COUNT(DISTINCT id_agente)        AS agentes,
    ROUND(AVG(duracao_min), 2)       AS tma_min,
    MIN(duracao_min)                 AS menor_duracao_min,
    MAX(duracao_min)                 AS maior_duracao_min,
    ROUND(AVG(tempo_espera_seg), 1)  AS espera_media_seg
FROM fato_chamados;
