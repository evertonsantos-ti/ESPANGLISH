export interface CriarJurado {
  idEvento: number;
  nome: string;
}

export interface AtualizarJurado extends CriarJurado {
  ativo: boolean;
}

export interface Jurado extends AtualizarJurado {
  id: number;
}
