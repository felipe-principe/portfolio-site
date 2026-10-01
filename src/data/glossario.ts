// Glossário dos termos de operação de atendimento usados nos cases.
// As fórmulas seguem as medidas DAX dos dashboards. `aliases` são regex (fonte);
// `cs: true` faz a busca diferenciar maiúsculas (siglas como "IR" não podem casar com "ir").

export interface Termo {
  id: string;
  termo: string;
  sigla?: string;
  def: string;
  calc?: string;
  aliases: { re: string; cs?: boolean }[];
}

export const glossario: Termo[] = [
  {
    id: 'pe', termo: 'Positive Experience', sigla: 'PE',
    def: 'Parcela de clientes que avaliaram o atendimento como positivo: notas 4 ou 5, numa escala de 1 a 5.',
    calc: 'pesquisas com nota 4 ou 5 ÷ pesquisas respondidas · meta de 95%',
    aliases: [{ re: 'Positive Experience' }, { re: 'PE', cs: true }],
  },
  {
    id: 'ir', termo: 'Issue Resolution', sigla: 'IR',
    def: 'Parcela de clientes que responderam "sim" à pergunta "seu problema foi resolvido?".',
    calc: 'respostas "sim" ÷ respostas à pergunta · meta de 89–90%',
    aliases: [{ re: 'Issue Resolution' }, { re: 'IR', cs: true }],
  },
  {
    id: 'sla', termo: 'SLA cumprido', sigla: 'SLA',
    def: 'SLA (Service Level Agreement) é o prazo combinado para resolver o chamado. O % de SLA cumprido mostra quantos chamados foram resolvidos dentro do prazo do canal.',
    calc: 'chamados resolvidos no prazo ÷ total de chamados · prazo de 25 min no chat e 18 min no telefone',
    aliases: [{ re: 'SLA', cs: true }],
  },
  {
    id: 'ns', termo: 'Nível de serviço', sigla: 'NS',
    def: 'Mede a fila, não a resolução: quantos contatos foram atendidos antes de um tempo máximo de espera.',
    calc: 'atendidos dentro do tempo-alvo ÷ total · 30 s no chat, 45 s no telefone · meta de 80%',
    aliases: [{ re: 'n[ií]vel de servi[cç]o' }],
  },
  {
    id: 'tma', termo: 'Tempo médio de atendimento', sigla: 'TMA',
    def: 'Quanto dura, em média, um atendimento, do início ao fim da conversa.',
    calc: 'soma das durações ÷ número de atendimentos (em minutos)',
    aliases: [{ re: 'TMA', cs: true }, { re: 'tempo m[eé]dio de atendimento' }],
  },
  {
    id: 'aht', termo: 'Average Handle Time', sigla: 'AHT',
    def: 'O mesmo conceito do TMA, com o nome usado em operações internacionais.',
    aliases: [{ re: 'AHT', cs: true }],
  },
  {
    id: 'tme', termo: 'Tempo médio de espera', sigla: 'TME',
    def: 'Quanto o cliente espera na fila até ser atendido.',
    calc: 'soma dos tempos de espera ÷ número de atendimentos (em segundos)',
    aliases: [{ re: 'TME', cs: true }, { re: 'tempo m[eé]dio de espera' }],
  },
  {
    id: 'abs', termo: 'Absenteísmo', sigla: 'ABS',
    def: 'Parcela dos dias de trabalho escalados em que o agente faltou.',
    calc: 'faltas ÷ dias escalados · meta de até 4%',
    aliases: [{ re: 'absente[ií]smo' }, { re: 'ABS', cs: true }],
  },
  {
    id: 'aderencia', termo: 'Aderência à escala',
    def: 'Quanto o agente cumpriu o horário planejado: estar logado e disponível nos momentos previstos na escala.',
    calc: 'minutos aderentes ÷ minutos escalados · meta de 85%',
    aliases: [{ re: 'ader[eê]ncia' }],
  },
  {
    id: 'abandono', termo: 'Taxa de abandono',
    def: 'Parcela dos contatos que desistiram na fila antes de serem atendidos.',
    calc: 'abandonos ÷ (atendidos + abandonos) · meta de até 5%',
    aliases: [{ re: 'abandonos?' }],
  },
  {
    id: 'reabertura', termo: 'Taxa de reabertura',
    def: 'Parcela dos chamados que voltaram a ser abertos depois de encerrados: sinal de que o problema não foi resolvido de fato.',
    calc: 'chamados reabertos ÷ total de chamados',
    aliases: [{ re: 'reabertura' }],
  },
  {
    id: 'backlog', termo: 'Backlog (casos pendentes)',
    def: 'Chamados ainda não encerrados. A idade do backlog mostra há quanto tempo eles estão parados.',
    aliases: [{ re: 'backlog' }, { re: 'casos pendentes' }],
  },
  {
    id: 'rr', termo: 'Response Rate',
    def: 'Taxa de resposta da pesquisa: em quantos atendimentos o cliente respondeu a avaliação.',
    calc: 'pesquisas respondidas ÷ atendimentos',
    aliases: [{ re: 'Response Rate' }, { re: 'taxa de resposta' }],
  },
  {
    id: 'csat', termo: 'Customer Satisfaction', sigla: 'CSAT',
    def: 'Nota de satisfação do cliente com o atendimento, normalmente de 1 a 5.',
    aliases: [{ re: 'CSAT', cs: true }],
  },
  {
    id: 'nps', termo: 'Net Promoter Score', sigla: 'NPS',
    def: 'O quanto o cliente recomendaria a empresa, de 0 a 10.',
    calc: '% de promotores (notas 9 e 10) − % de detratores (notas 0 a 6)',
    aliases: [{ re: 'NPS', cs: true }],
  },
  {
    id: 'qc', termo: 'Quality Control', sigla: 'QC',
    def: 'Nota da monitoria de qualidade (0 a 100): o time de qualidade avalia atendimentos com um formulário padrão. Também chamada de QA.',
    calc: 'média das notas de monitoria do período',
    aliases: [{ re: 'QC', cs: true }, { re: 'QA', cs: true }],
  },
  {
    id: 'wfm', termo: 'Workforce Management', sigla: 'WFM',
    def: 'A área que dimensiona quantas pessoas são necessárias em cada horário e monta a escala.',
    aliases: [{ re: 'WFM', cs: true }],
  },
  {
    id: 'newhire', termo: 'New Hires',
    def: 'Agentes recém-contratados, em formação para entrar na operação.',
    aliases: [{ re: 'New Hires?' }, { re: 'novatos?' }],
  },
  {
    id: 'nesting', termo: 'Nesting',
    def: 'A fase depois do treinamento em sala: o novato já atende clientes reais, com acompanhamento próximo do educador, até o go-live.',
    aliases: [{ re: 'nesting' }],
  },
  {
    id: 'golive', termo: 'Go-live',
    def: 'A data em que o novato passa a atender na operação de forma independente.',
    aliases: [{ re: 'go-live' }],
  },
  {
    id: 'rampup', termo: 'Ramp-up',
    def: 'O período de amadurecimento depois do go-live, até o agente atingir as metas cheias. Aqui ele é dividido em Nesting, 30, 60, 90 e 90+ dias, cada fase com a sua meta.',
    aliases: [{ re: 'ramp-up' }],
  },
  {
    id: 'tsat', termo: 'T-SAT',
    def: 'Satisfação do novato com o treinamento, numa nota de 1 a 5.',
    aliases: [{ re: 'T-SAT', cs: true }],
  },
  {
    id: 'pp', termo: 'Pontos percentuais', sigla: 'p.p.',
    def: 'A diferença absoluta entre duas porcentagens. De 80% para 82% são +2 p.p. (e não +2,5%).',
    aliases: [{ re: 'p\\.p\\.' }],
  },
];
