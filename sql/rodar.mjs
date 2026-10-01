// Monta o banco a partir dos CSVs, roda todas as consultas de consultas/ e grava os resultados
// em src/data/sql.json (usado pela seção de SQL da página do case).
// Uso: cd sql && npm install && node rodar.mjs
import { DuckDBInstance } from '@duckdb/node-api';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const MAX_LINHAS = 12;
const db = await DuckDBInstance.create(':memory:');
const con = await db.connect();

await con.run(readFileSync('01_schema.sql', 'utf8'));
await con.run(readFileSync('02_carga_duckdb.sql', 'utf8'));

const meta = (sql, chave) => (sql.match(new RegExp(`^-- ${chave}:\\s*(.+)$`, 'm')) ?? [])[1]?.trim() ?? '';
const saida = [];
for (const arquivo of readdirSync('consultas').filter(f => f.endsWith('.sql')).sort()) {
  const sql = readFileSync(`consultas/${arquivo}`, 'utf8').trim();
  const r = await con.runAndReadAll(sql);
  const colunas = r.columnNames();
  const linhas = r.getRowsJson();
  saida.push({
    id: arquivo.replace(/\.sql$/, ''),
    arquivo,
    nivel: meta(sql, 'Nível'),
    titulo: meta(sql, 'Título'),
    pergunta: meta(sql, 'Pergunta'),
    usa: meta(sql, 'O que usa'),
    leitura: meta(sql, 'Leitura'),
    // o código exibido no site, sem o cabeçalho de comentários
    sql: sql.split('\n').filter(l => !/^-- (Nível|Título|Pergunta|O que usa|Leitura):/.test(l)).join('\n').trim(),
    colunas,
    linhas: linhas.slice(0, MAX_LINHAS),
    total_linhas: linhas.length,
  });
  console.log(`\n== ${arquivo} (${linhas.length} linhas)`);
  console.log(colunas.join(' | '));
  for (const l of linhas.slice(0, MAX_LINHAS)) console.log(l.join(' | '));
}
writeFileSync('../src/data/sql.json', JSON.stringify(saida, null, 2) + '\n');
console.log(`\nok: ${saida.length} consultas em src/data/sql.json`);
