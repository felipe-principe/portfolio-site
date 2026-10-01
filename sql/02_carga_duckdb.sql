-- =====================================================================
-- Carga dos CSVs (DuckDB, usado para gerar os resultados exibidos no site).
-- Os arquivos usam ";" como separador e vírgula como decimal.
-- No MySQL, o equivalente é LOAD DATA INFILE ... FIELDS TERMINATED BY ';'
-- (ou o assistente de importação do MySQL Workbench).
-- =====================================================================

CREATE MACRO csv(nome) AS TABLE
    SELECT * FROM read_csv('dados/' || nome || '.csv', delim = ';', header = true, all_varchar = true);
CREATE MACRO num(txt) AS CAST(REPLACE(NULLIF(txt, ''), ',', '.') AS DECIMAL(9,1));

INSERT INTO dim_data
SELECT CAST(Data AS DATE), CAST(Ano AS INT), CAST(Mes AS INT), Nome_Mes, Trimestre,
       CAST(Dia AS INT), Nome_Dia_Semana, Fim_de_Semana, Feriado, NULLIF(Nome_Feriado, '')
FROM csv('Dim_Data');

INSERT INTO dim_canal
SELECT ID_Canal, Nome_Canal, Tipo_Canal, CAST(Meta_SLA_Min AS INT),
       CAST(Meta_Nivel_Servico_Seg AS INT), CAST(Meta_Nivel_Servico_Pct AS DECIMAL(5,2))
FROM csv('Dim_Canal');

INSERT INTO dim_agente
SELECT ID_Agente, Usuario, Nome_Agente, Supervisor, Turno, CAST(Data_Contratacao AS DATE)
FROM csv('Dim_Agente');

INSERT INTO dim_cliente
SELECT ID_Cliente, Plano, Regiao, Pais, CAST(Data_Assinatura AS DATE)
FROM csv('Dim_Cliente');

INSERT INTO dim_motivo
SELECT ID_Motivo, Categoria, Subcategoria
FROM csv('Dim_Motivo_Contato');

INSERT INTO fato_chamados
SELECT ID_Chamado, CAST(Data_Abertura AS TIMESTAMP), CAST(NULLIF(Data_Fechamento, '') AS TIMESTAMP),
       ID_Cliente, ID_Agente, ID_Canal, ID_Motivo,
       num(Duracao_Min), SLA_Cumprido, num(Tempo_Espera_Seg), Nivel_Servico_Cumprido,
       Pesquisa_Respondida, CAST(NULLIF(Nota_Experiencia, '') AS INT), NULLIF(Problema_Resolvido, ''),
       Reaberto, Status_Caso
FROM csv('Fato_Chamados');

INSERT INTO fato_abandonos
SELECT ID_Abandono, CAST(Data_Hora AS TIMESTAMP), ID_Canal, num(Tempo_Espera_Seg)
FROM csv('Fato_Abandonos');

INSERT INTO fato_escala
SELECT ID_Escala, CAST(Data AS DATE), ID_Agente, CAST(Minutos_Escalados AS INT), Falta,
       NULLIF(Tipo_Ausencia, ''), CAST(Minutos_Aderentes AS INT), CAST(Minutos_Base_Aderencia AS INT)
FROM csv('Fato_Escala');
