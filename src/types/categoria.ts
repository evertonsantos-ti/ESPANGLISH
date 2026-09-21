export interface CriarCategoria {
  idEvento: number;
  nome: string;
  ordem: number;
}

export interface AtualizarCategoria extends CriarCategoria {
  ativo: boolean;
}

export interface Categoria extends AtualizarCategoria {
  id: number;
}
