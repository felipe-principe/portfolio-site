-- Nível: Fundamentos
-- Título: Volume e SLA por mês
-- Pergunta: Como o volume e o SLA se comportaram mês a mês?
-- O que usa: GROUP BY com MONTH(), CASE dentro do SUM para contar só os chamados no prazo, ORDER BY.
-- Leitura: junho é o mês de maior volume e o único com SLA abaixo de 80%.
SELECT
    MONTH(data_abertura)                                                     AS mes,
    COUNT(*)                                                                 AS chamados,
    SUM(CASE WHEN sla_cumprido = 'Sim' THEN 1 ELSE 0 END)                    AS chamados_no_sla,
    ROUND(100.0 * SUM(CASE WHEN sla_cumprido = 'Sim' THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_sla,
    ROUND(AVG(duracao_min), 2)                                               AS tma_min
FROM fato_chamados
WHERE YEAR(data_abertura) = 2025
GROUP BY MONTH(data_abertura)
ORDER BY mes;
