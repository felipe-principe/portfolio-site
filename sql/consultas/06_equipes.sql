-- Nível: Fundamentos
-- Título: Ranking de equipes
-- Pergunta: Como cada equipe entrega em volume, TMA, SLA e satisfação?
-- O que usa: INNER JOIN com a dimensão de agentes, CONCAT, CASE e média só de quem respondeu a pesquisa.
-- Leitura: as três equipes com maior TMA também têm o pior SLA e a menor satisfação; é por elas que o plano de ação começa.
SELECT
    CONCAT('Equipe ', a.supervisor)                                          AS equipe,
    COUNT(*)                                                                 AS chamados,
    ROUND(AVG(c.duracao_min), 2)                                             AS tma_min,
    ROUND(100.0 * SUM(CASE WHEN c.sla_cumprido = 'Sim' THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_sla,
    ROUND(100.0 * SUM(CASE WHEN c.nota_experiencia >= 4 THEN 1 ELSE 0 END)
          / SUM(CASE WHEN c.pesquisa_respondida = 'Sim' THEN 1 ELSE 0 END), 1) AS pct_positive_experience
FROM fato_chamados AS c
INNER JOIN dim_agente AS a
        ON a.id_agente = c.id_agente
GROUP BY a.supervisor
ORDER BY tma_min DESC;
