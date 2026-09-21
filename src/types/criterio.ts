export interface CriarCriterio {
  idCategoria: number;
  nome: string;
  ordem: number;
}

export interface AtualizarCriterio extends CriarCriterio {
  ativo: boolean;
}

export interface Criterio extends AtualizarCriterio {
  id: number;
}
