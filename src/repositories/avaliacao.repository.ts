import { execute, query, queryOne, withTransaction } from "../database/query";
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
    const registros = await query<Row>(
      `SELECT ID, EQUIPE_ID, CATEGORIA_ID, JURADO_ID FROM AVALIACAO ORDER BY ID`,
    );
    return registros.map((r) => ({
      id: r.ID,
      idEquipe: r.EQUIPE_ID,
      idCategoria: r.CATEGORIA_ID,
      idJurado: r.JURADO_ID,
    }));
  }

  async buscarPorId(id: number): Promise<Avaliacao | null> {
    const registro = await queryOne<Row>(
      `SELECT * FROM AVALIACAO WHERE ID = ?`,
      [id],
    );
    return map(registro);
  }

  async buscarPorJurado(
    idJurado: number,
    eventoId: number,
  ): Promise<Avaliacao[]> {
    const registros = await query<Row>(
      `
        SELECT A.ID, A.EQUIPE_ID, A.CATEGORIA_ID, A.JURADO_ID
        FROM AVALIACAO A
        INNER JOIN EQUIPE E ON E.ID = A.EQUIPE_ID
        INNER JOIN CATEGORIA C ON C.ID = A.CATEGORIA_ID
        INNER JOIN JURADO_CATEGORIA JC
          ON JC.JURADO_ID = A.JURADO_ID AND JC.CATEGORIA_ID = A.CATEGORIA_ID
        WHERE A.JURADO_ID = ?
          AND E.EVENTO_ID = ?
          AND C.EVENTO_ID = ?
        ORDER BY A.ID
      `,
      [idJurado, eventoId, eventoId],
    );
    return registros.map((registro) => map(registro) as Avaliacao);
  }

  async relacionamentosValidos(dados: CriarAvaliacao): Promise<boolean> {
    const registro = await queryOne<{ ID: number }>(
      `
        SELECT J.ID
        FROM JURADO J
        INNER JOIN CATEGORIA C ON C.EVENTO_ID = J.EVENTO_ID
        INNER JOIN EQUIPE E ON E.EVENTO_ID = J.EVENTO_ID
        INNER JOIN EVENTO EV ON EV.ID = J.EVENTO_ID
        INNER JOIN JURADO_CATEGORIA JC
          ON JC.JURADO_ID = J.ID AND JC.CATEGORIA_ID = C.ID
        WHERE J.ID = ?
          AND C.ID = ?
          AND E.ID = ?
          AND J.ATIVO = TRUE
          AND C.ATIVO = TRUE
          AND EV.ATIVO = TRUE
      `,
      [dados.idJurado, dados.idCategoria, dados.idEquipe],
    );
    return registro !== null;
  }

  async criar(dados: CriarAvaliacao): Promise<Avaliacao> {
    const resultado = await execute(
      `
      INSERT INTO AVALIACAO (EQUIPE_ID, CATEGORIA_ID, JURADO_ID)
      VALUES (?, ?, ?)
    `,
      [dados.idEquipe, dados.idCategoria, dados.idJurado],
    );
    const registro = await queryOne<Row>(
      `SELECT * FROM AVALIACAO WHERE ID = ?`,
      [resultado.insertId],
    );

    if (!registro)
      throw new Error("Avaliação não foi retornada após a criação");

    return map(registro) as Avaliacao;
  }

  async deletar(id: number): Promise<boolean> {
    return withTransaction(async (transaction) => {
      await transaction.execute(`DELETE FROM NOTA WHERE AVALIACAO_ID = ?`, [id]);
      const resultado = await transaction.execute(
        `DELETE FROM AVALIACAO WHERE ID = ?`,
        [id],
      );
      return resultado.affectedRows > 0;
    });
  }
}
