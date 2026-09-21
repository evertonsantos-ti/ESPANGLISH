export interface CriarMovimentacaoPontuacao {
  idEvento: number;
  idEquipe: number;
  tipo: string;
  descricao: string;
  pontos: number;
}

export interface MovimentacaoPontuacao extends CriarMovimentacaoPontuacao {
  id: number;
  dataLancamento: Date;
}
