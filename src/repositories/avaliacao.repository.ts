import { query, queryOne } from "../database/query";
import { Avaliacao, CriarAvaliacao } from "../types/avaliacao";

interface Row {
  ID: number;
  EQUIPE_ID: number;
  CATEGORIA_ID: number;
  JURADO_ID: number;
}

function map(r: Row | null): Avaliacao | null {
  if (!r) return null;
  return {
    id: r.ID,
    idEquipe: r.EQUIPE_ID,
    idCategoria: r.CATEGORIA_ID,
    idJurado: r.JURADO_ID,
  };
}

export class AvaliacaoRepository {
  async listar(): Promise<Avaliacao[]> {
    const registros = await query<Row>(`SELECT ID, EQUIPE_ID, CATEGORIA_ID, JURADO_ID FROM AVALIACAO ORDER BY ID`);
    return registros.map((r) => ({ id: r.ID, idEquipe: r.EQUIPE_ID, idCategoria: r.CATEGORIA_ID, idJurado: r.JURADO_ID }));
  }

  async buscarPorId(id: number): Promise<Avaliacao | null> {
    const registro = await queryOne<Row>(`SELECT * FROM AVALIACAO WHERE ID = ?`, [id]);
    return map(registro);
  }

  async criar(dados: CriarAvaliacao): Promise<Avaliacao> {
    const registro = await queryOne<Row>(
      `
      INSERT INTO AVALIACAO (EQUIPE_ID, CATEGORIA_ID, JURADO_ID)
      VALUES (?, ?, ?)
      RETURNING ID, EQUIPE_ID, CATEGORIA_ID, JURADO_ID
    `,
      [dados.idEquipe, dados.idCategoria, dados.idJurado],
    );

    if (!registro) throw new Error("Avaliação não foi retornada após a criação");

    return map(registro) as Avaliacao;
  }
}
