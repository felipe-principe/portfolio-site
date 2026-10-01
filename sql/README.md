# Central de Atendimento · consultas SQL

O dashboard **Central de Atendimento** (Power BI) recriado em SQL: o mesmo modelo estrela,
as mesmas perguntas de negócio, respondidas direto no banco. Os números batem com o dashboard
(141.431 chamados, TMA de 15,12 min, SLA de 76,9% e absenteísmo de 5,81% em junho).

> Base 100% fictícia, criada para portfólio a partir dos KPIs de uma operação de atendimento de streaming.

## Estrutura

| Arquivo | O que é |
|---|---|
| `01_schema.sql` | Criação das 8 tabelas (3 fatos, 5 dimensões), com chaves primárias e estrangeiras |
| `02_carga_duckdb.sql` | Carga dos CSVs (separador `;` e vírgula decimal) |
| `dados/` | Os CSVs da base |
| `consultas/` | 7 consultas, cada uma com a pergunta de negócio no cabeçalho |
| `rodar.mjs` | Monta o banco, roda as consultas e gera os resultados exibidos no site |

**Sintaxe:** MySQL 8. Os resultados do site são gerados com DuckDB, que roda direto dos CSVs,
sem servidor, e aceita a mesma sintaxe.

```bash
cd sql
npm install
node rodar.mjs
```

No MySQL Workbench: rode `01_schema.sql`, importe cada CSV em sua tabela
(Table Data Import Wizard, separador `;`) e execute os arquivos de `consultas/`.

## O modelo

```
                dim_data        dim_cliente
                    |                |
dim_motivo ── fato_chamados ── dim_agente ── fato_escala ── dim_data
                    |                              
                dim_canal ── fato_abandonos
```

- **fato_chamados**: um registro por chamado atendido (141.431)
- **fato_abandonos**: um registro por contato que desistiu da fila (6.498)
- **fato_escala**: um registro por dia de escala de cada agente (26.052)

## As consultas

| # | Pergunta | O que usa |
|---|---|---|
| 01 | Qual é o tamanho da operação no ano? | `COUNT`, `COUNT(DISTINCT)`, `AVG`, `MIN`, `MAX` |
| 02 | Como volume e SLA se comportaram mês a mês? | `GROUP BY MONTH()`, `SUM(CASE WHEN ...)` |
| 03 | Quais chamados de telefone estouraram o SLA em junho? | `WHERE` com `AND`, intervalo de datas, `ORDER BY`, `LIMIT` |
| 04 | Quais os 5 motivos que mais geram contato? | `INNER JOIN`, `GROUP BY`, `ORDER BY`, `LIMIT` |
| 05 | Em que meses o absenteísmo passou de 4%? | `GROUP BY`, `HAVING` |
| 06 | Como cada equipe entrega? | `INNER JOIN`, `CONCAT`, `CASE` |
| 07 | Em qual canal e turno o nível de serviço sofre mais? | `INNER JOIN`, `CASE` com `HOUR()`, `GROUP BY` em duas colunas |

## Guia de estudo

Explicações curtas de cada técnica, para saber defender cada linha.

**Porcentagem com `SUM(CASE WHEN ...)`** (02, 04, 05, 06, 07)
`SUM(CASE WHEN sla_cumprido = 'Sim' THEN 1 ELSE 0 END)` soma 1 para cada chamado no prazo e 0
para os outros, ou seja, conta só os que cumpriram. Dividir por `COUNT(*)` e multiplicar por
`100.0` dá a porcentagem. O `100.0` (com ponto) garante divisão com casas decimais.

**`WHERE` × `HAVING`** (03 e 05)
`WHERE` filtra linhas **antes** de agrupar (ex.: só chamados de junho). `HAVING` filtra o
resultado **depois** do `GROUP BY` (ex.: só os meses com absenteísmo acima de 4%). Por isso o
`HAVING` repete a conta: o filtro é sobre o valor agregado.

**Intervalo de datas** (03)
`data_abertura >= '2025-06-01' AND data_abertura < '2025-07-01'` pega junho inteiro, inclusive
o dia 30 às 23h59, o que um `BETWEEN '2025-06-01' AND '2025-06-30'` perderia em colunas com hora.

**`INNER JOIN`** (04, 06, 07)
Liga a tabela fato à dimensão pela chave (`ON m.id_motivo = c.id_motivo`) para trazer o nome
da categoria, da equipe ou do canal. Os apelidos (`AS c`, `AS m`) deixam claro de qual tabela
vem cada coluna.

**Média só de quem respondeu** (06)
A satisfação (Positive Experience) é calculada sobre quem respondeu a pesquisa, e não sobre
todos os chamados: notas 4 e 5 divididas pelo total de pesquisas respondidas.
