export interface CriarAvaliacao {
  idEquipe: number;
  idCategoria: number;
  idJurado: number;
}

export interface Avaliacao extends CriarAvaliacao {
  id: number;
}
