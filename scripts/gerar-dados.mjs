// Lê os CSVs da base do dashboard e gera os números usados nos gráficos do site.
// Uso: node scripts/gerar-dados.mjs ["<pasta dos CSVs>"]  (padrão: sql/dados)
// Rodar de novo sempre que a base mudar: o site nunca tem número digitado à mão.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { fileURLToPath } from 'node:url';
const base = process.argv[2] ?? fileURLToPath(new URL('../sql/dados', import.meta.url));
const out = new URL('../src/data/central-atendimento.json', import.meta.url);

function csv(name) {
  const lines = readFileSync(join(base, name), 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
  const head = lines[0].split(';');
  return lines.slice(1).map(l => Object.fromEntries(l.split(';').map((v, i) => [head[i], v])));
}

const chamados = csv('Fato_Chamados.csv');
const escala = csv('Fato_Escala.csv');
const abandonos = csv('Fato_Abandonos.csv');
const canais = csv('Dim_Canal.csv');

const months = Array.from({ length: 12 }, () => ({ volume: 0, sla: 0, escalados: 0, faltas: 0 }));
for (const c of chamados) {
  const m = +c.Data_Abertura.slice(5, 7) - 1;
  months[m].volume++;
  if (c.SLA_Cumprido === 'Sim') months[m].sla++;
}
for (const e of escala) {
  const m = +e.Data.slice(5, 7) - 1;
  months[m].escalados++;
  if (e.Falta === 'Sim') months[m].faltas++;
}
const round = (n, d = 1) => Math.round(n * 10 ** d) / 10 ** d;

const data = {
  gerado: new Date().toISOString().slice(0, 10),
  total: chamados.length,
  slaAno: round((chamados.filter(c => c.SLA_Cumprido === 'Sim').length / chamados.length) * 100, 2),
  canais: canais.map(c => c.Nome_Canal),
  meses: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  volume: months.map(m => m.volume),
  sla: months.map(m => round((m.sla / m.volume) * 100)),
  abs: months.map(m => round((m.faltas / m.escalados) * 100, 2)),
  metaAbs: 4,
  linhas: {
    Fato_Chamados: chamados.length,
    Fato_Escala: escala.length,
    Fato_Abandonos: abandonos.length,
    Dim_Cliente: csv('Dim_Cliente.csv').length,
    Dim_Agente: csv('Dim_Agente.csv').length,
    Dim_Data: csv('Dim_Data.csv').length,
    Dim_Motivo_Contato: csv('Dim_Motivo_Contato.csv').length,
    Dim_Canal: canais.length,
    Dim_Hora: 24,
  },
};
writeFileSync(out, JSON.stringify(data, null, 2) + '\n');
console.log(`ok: ${data.total} chamados, pico ${Math.max(...data.volume)}, ABS jun ${data.abs[5]}%`);
