export interface Evento {
  id: number;
  nome: string;
  dataInicio: Date;
  dataFim: Date;
  ativo: Boolean;
}

export interface CriarEvento {
  nome: string;
  dataInicio: Date;
  dataFim: Date;
}
