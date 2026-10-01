-- Nível: Fundamentos
-- Título: Meses acima da meta de ABS
-- Pergunta: Em que meses o absenteísmo passou da meta de 4%?
-- O que usa: GROUP BY na tabela de escala, CASE para contar faltas e HAVING para filtrar o resultado agrupado.
-- Leitura: só junho e julho passam da meta, e junho lidera com 5,81%, no mesmo mês em que o SLA caiu para 76,9%.
SELECT
    MONTH(data)                                                              AS mes,
    COUNT(*)                                                                 AS dias_escalados,
    SUM(CASE WHEN falta = 'Sim' THEN 1 ELSE 0 END)                           AS faltas,
    ROUND(100.0 * SUM(CASE WHEN falta = 'Sim' THEN 1 ELSE 0 END) / COUNT(*), 2) AS pct_abs
FROM fato_escala
GROUP BY MONTH(data)
HAVING 100.0 * SUM(CASE WHEN falta = 'Sim' THEN 1 ELSE 0 END) / COUNT(*) > 4
ORDER BY pct_abs DESC;
