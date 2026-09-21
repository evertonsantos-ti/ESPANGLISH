export interface CriarNota {
  idAvaliacao: number;
  idCriterio: number;
  nota: number;
}

export interface Nota extends CriarNota {
  id: number;
}
