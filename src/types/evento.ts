export interface CriarEvento {
  nome: string;
  dataInicio: Date;
  dataFim: Date;
  competencia: number;
}

export interface AtualizarEvento extends CriarEvento {
  ativo: Boolean;
}

export interface Evento extends AtualizarEvento {
  id: number;
}
