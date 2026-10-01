-- Nível: Fundamentos
-- Título: Canal × turno
-- Pergunta: Em qual canal e turno o nível de serviço sofre mais?
-- O que usa: INNER JOIN com a dimensão de canais, CASE para criar o turno a partir da hora, GROUP BY em duas colunas.
-- Leitura: a tarde concentra a maior espera e o pior nível de serviço (~73%) nos dois canais; a noite passa folgada da meta de 80%.
SELECT
    ch.nome_canal                                                            AS canal,
    CASE
        WHEN HOUR(c.data_abertura) BETWEEN 6 AND 13  THEN '1. Manhã'
        WHEN HOUR(c.data_abertura) BETWEEN 14 AND 21 THEN '2. Tarde'
        ELSE '3. Noite'
    END                                                                      AS turno,
    COUNT(*)                                                                 AS chamados,
    ROUND(AVG(c.tempo_espera_seg), 1)                                        AS espera_media_seg,
    ROUND(100.0 * SUM(CASE WHEN c.nivel_servico_cumprido = 'Sim' THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_nivel_servico
FROM fato_chamados AS c
INNER JOIN dim_canal AS ch
        ON ch.id_canal = c.id_canal
GROUP BY ch.nome_canal, turno
ORDER BY canal, turno;
