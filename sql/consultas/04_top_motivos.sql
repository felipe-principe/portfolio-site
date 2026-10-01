-- Nível: Fundamentos
-- Título: Top 5 motivos
-- Pergunta: Quais são os 5 motivos que mais geram contato, e qual o SLA de cada um?
-- O que usa: INNER JOIN com a dimensão de motivos, GROUP BY, ORDER BY e LIMIT.
-- Leitura: com volumes parecidos, as categorias entregam SLAs bem diferentes: o gargalo é o tipo de caso, não só o volume.
SELECT
    m.categoria,
    COUNT(*)                                                                 AS chamados,
    ROUND(100.0 * SUM(CASE WHEN c.sla_cumprido = 'Sim' THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_sla,
    ROUND(AVG(c.duracao_min), 2)                                             AS tma_min
FROM fato_chamados AS c
INNER JOIN dim_motivo AS m
        ON m.id_motivo = c.id_motivo
GROUP BY m.categoria
ORDER BY chamados DESC
LIMIT 5;
