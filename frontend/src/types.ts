export interface FormData {
  freelancerNome: string
  clienteNome: string
  tipo: string
  descricao: string
  prazo: string
  orcamento: string
  tecnologias: string
  extras: string
}

export interface CronogramaItem {
  fase: string
  duracao: string
  entregaveis: string
}

export interface Investimento {
  total: string
  entrada: string
  parcelas: string
  justificativa: string
}

export interface Proposta {
  titulo: string
  resumo: string
  escopo: string[]
  naoIncluso: string[]
  cronograma: CronogramaItem[]
  investimento: Investimento
  termos: string[]
  validade: string
  data: string
  freelancerNome: string
  clienteNome: string
}
