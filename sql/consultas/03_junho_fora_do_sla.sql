-- Nível: Fundamentos
-- Título: Junho fora do SLA
-- Pergunta: Em junho, quais chamados de telefone estouraram o SLA com a maior espera na fila?
-- O que usa: WHERE com AND e intervalo de datas, ORDER BY decrescente e LIMIT.
-- Leitura: a lista que o supervisor usaria para ouvir as ligações e entender o que travou.
SELECT
    id_chamado,
    data_abertura,
    id_agente,
    tempo_espera_seg,
    duracao_min,
    status_caso
FROM fato_chamados
WHERE data_abertura >= '2025-06-01'
  AND data_abertura <  '2025-07-01'
  AND id_canal = 'CAN2'            -- Telefone
  AND sla_cumprido = 'Nao'
ORDER BY tempo_espera_seg DESC
LIMIT 10;
