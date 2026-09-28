import { query, queryOne } from "../database/query";
import { Nota, CriarNota } from "../types/nota";

interface Row {
  ID: number;
  AVALIACAO_ID: number;
  CRITERIO_ID: number;
  NOTA: number;
}

function map(r: Row | null): Nota | null {
  if (!r) return null;
  return {
    id: r.ID,
    idAvaliacao: r.AVALIACAO_ID,
    idCriterio: r.CRITERIO_ID,
    nota: r.NOTA,
  };
}

export class NotaRepository {
  async listar(): Promise<Nota[]> {
    const registros = await query<Row>(
      `SELECT ID, AVALIACAO_ID, CRITERIO_ID, NOTA FROM NOTA ORDER BY ID`,
    );
    return registros.map((r) => ({
      id: r.ID,
      idAvaliacao: r.AVALIACAO_ID,
      idCriterio: r.CRITERIO_ID,
      nota: r.NOTA,
    }));
  }

  async buscarPorId(id: number): Promise<Nota | null> {
    const registro = await queryOne<Row>(`SELECT * FROM NOTA WHERE ID = ?`, [
      id,
    ]);
    return map(registro);
  }

  async listarPorJurado(idJurado: number, eventoId: number): Promise<Nota[]> {
    const registros = await query<Row>(
      `
        SELECT N.ID, N.AVALIACAO_ID, N.CRITERIO_ID, N.NOTA
        FROM NOTA N
        INNER JOIN AVALIACAO A ON A.ID = N.AVALIACAO_ID
        INNER JOIN EQUIPE E ON E.ID = A.EQUIPE_ID
        INNER JOIN CATEGORIA CA ON CA.ID = A.CATEGORIA_ID
        INNER JOIN CRITERIO CR ON CR.ID = N.CRITERIO_ID
        INNER JOIN JURADO_CATEGORIA JC
          ON JC.JURADO_ID = A.JURADO_ID AND JC.CATEGORIA_ID = A.CATEGORIA_ID
        WHERE A.JURADO_ID = ?
          AND E.EVENTO_ID = ?
          AND CA.EVENTO_ID = ?
          AND CR.CATEGORIA_ID = A.CATEGORIA_ID
        ORDER BY N.ID
      `,
      [idJurado, eventoId, eventoId],
    );
    return registros.map((registro) => map(registro) as Nota);
  }

  async avaliacaoDoJurado(
    idAvaliacao: number,
    idJurado: number,
    eventoId: number,
  ): Promise<{ idCategoria: number } | null> {
    return queryOne<{ idCategoria: number }>(
      `
        SELECT A.CATEGORIA_ID AS "idCategoria"
        FROM AVALIACAO A
        INNER JOIN EQUIPE E ON E.ID = A.EQUIPE_ID
        INNER JOIN CATEGORIA C ON C.ID = A.CATEGORIA_ID
        INNER JOIN JURADO_CATEGORIA JC
          ON JC.JURADO_ID = A.JURADO_ID AND JC.CATEGORIA_ID = A.CATEGORIA_ID
        WHERE A.ID = ?
          AND A.JURADO_ID = ?
          AND E.EVENTO_ID = ?
          AND C.EVENTO_ID = ?
      `,
      [idAvaliacao, idJurado, eventoId, eventoId],
    );
  }

  async criterioDaCategoria(idCriterio: number, idCategoria: number): Promise<boolean> {
    const registro = await queryOne<{ ID: number }>(
      `SELECT ID FROM CRITERIO WHERE ID = ? AND CATEGORIA_ID = ? AND ATIVO = TRUE`,
      [idCriterio, idCategoria],
    );
    return registro !== null;
  }

  async notaDoJurado(idNota: number, idJurado: number, eventoId: number): Promise<Nota | null> {
    const registro = await queryOne<Row>(
      `
        SELECT N.ID, N.AVALIACAO_ID, N.CRITERIO_ID, N.NOTA
        FROM NOTA N
        INNER JOIN AVALIACAO A ON A.ID = N.AVALIACAO_ID
        INNER JOIN EQUIPE E ON E.ID = A.EQUIPE_ID
        INNER JOIN CATEGORIA C ON C.ID = A.CATEGORIA_ID
        INNER JOIN JURADO_CATEGORIA JC
          ON JC.JURADO_ID = A.JURADO_ID AND JC.CATEGORIA_ID = A.CATEGORIA_ID
        WHERE N.ID = ?
          AND A.JURADO_ID = ?
          AND E.EVENTO_ID = ?
          AND C.EVENTO_ID = ?
      `,
      [idNota, idJurado, eventoId, eventoId],
    );
    return map(registro);
  }

  async criar(dados: CriarNota): Promise<Nota> {
    const registro = await queryOne<Row>(
      `
      INSERT INTO NOTA (AVALIACAO_ID, CRITERIO_ID, NOTA)
      VALUES (?, ?, ?)
      RETURNING ID, AVALIACAO_ID, CRITERIO_ID, NOTA
    `,
      [dados.idAvaliacao, dados.idCriterio, dados.nota],
    );

    if (!registro) throw new Error("Nota não foi retornada após a criação");

    return map(registro) as Nota;
  }

  async alterar(id: number, dados: CriarNota): Promise<Nota | null> {
    const registro = await queryOne<Row>(
      `
      UPDATE NOTA
      SET AVALIACAO_ID = ?, CRITERIO_ID = ?, NOTA = ?
      WHERE ID = ?
      RETURNING *
    `,
      [dados.idAvaliacao, dados.idCriterio, dados.nota, id],
    );

    return map(registro);
  }
}
