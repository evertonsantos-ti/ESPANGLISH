import { execute, query, queryOne } from "../database/query";
import { Nota, CriarNota } from "../types/nota";

interface RowListar {
  ID: number;
  AVALIACAO_ID: number;
  CRITERIO_ID: number;
  PONTUACAO_FINAL: number;
}
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
    const registros = await query<RowListar>(
      `WITH NOTAS_JURADOS AS (
    SELECT
        A.EQUIPE_ID,
        A.CATEGORIA_ID,
        N.CRITERIO_ID,
        SUM(N.NOTA) AS SOMA_NOTAS,
        COUNT(DISTINCT A.JURADO_ID) AS JURADOS_AVALIARAM
    FROM AVALIACAO A
    INNER JOIN NOTA N
        ON N.AVALIACAO_ID = A.ID
    GROUP BY
        A.EQUIPE_ID,
        A.CATEGORIA_ID,
        N.CRITERIO_ID
),

JURADOS_CATEGORIA AS (
    SELECT
        JC.CATEGORIA_ID,
        COUNT(DISTINCT JC.JURADO_ID) AS JURADOS_ESPERADOS
    FROM JURADO_CATEGORIA JC
    GROUP BY
        JC.CATEGORIA_ID
)

SELECT
    N.ID,
    N.AVALIACAO_ID,
    N.CRITERIO_ID,

    CAST(
        NJ.SOMA_NOTAS AS DECIMAL(18, 2)
    ) / JC.JURADOS_ESPERADOS AS PONTUACAO_FINAL

FROM NOTA N

INNER JOIN AVALIACAO A
    ON A.ID = N.AVALIACAO_ID

INNER JOIN NOTAS_JURADOS NJ
    ON NJ.EQUIPE_ID = A.EQUIPE_ID
    AND NJ.CATEGORIA_ID = A.CATEGORIA_ID
    AND NJ.CRITERIO_ID = N.CRITERIO_ID

INNER JOIN JURADOS_CATEGORIA JC
    ON JC.CATEGORIA_ID = A.CATEGORIA_ID;`,
    );
    return registros.map((r) => ({
      id: r.ID,
      idAvaliacao: r.AVALIACAO_ID,
      idCriterio: r.CRITERIO_ID,
      nota: r.PONTUACAO_FINAL,
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
        SELECT A.CATEGORIA_ID AS idCategoria
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

  async criterioDaCategoria(
    idCriterio: number,
    idCategoria: number,
  ): Promise<boolean> {
    const registro = await queryOne<{ ID: number }>(
      `SELECT ID FROM CRITERIO WHERE ID = ? AND CATEGORIA_ID = ? AND ATIVO = TRUE`,
      [idCriterio, idCategoria],
    );
    return registro !== null;
  }

  async notaDoJurado(
    idNota: number,
    idJurado: number,
    eventoId: number,
  ): Promise<Nota | null> {
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
    const resultado = await execute(
      `
      INSERT INTO NOTA (AVALIACAO_ID, CRITERIO_ID, NOTA)
      VALUES (?, ?, ?)
    `,
      [dados.idAvaliacao, dados.idCriterio, dados.nota],
    );
    const registro = await queryOne<Row>(
      `SELECT * FROM NOTA WHERE ID = ?`,
      [resultado.insertId],
    );

    if (!registro) throw new Error("Nota não foi retornada após a criação");

    return map(registro) as Nota;
  }

  async alterar(id: number, dados: CriarNota): Promise<Nota | null> {
    const resultado = await execute(
      `
      UPDATE NOTA
      SET AVALIACAO_ID = ?, CRITERIO_ID = ?, NOTA = ?
      WHERE ID = ?
    `,
      [dados.idAvaliacao, dados.idCriterio, dados.nota, id],
    );
    if (resultado.affectedRows === 0) return null;
    const registro = await queryOne<Row>(`SELECT * FROM NOTA WHERE ID = ?`, [id]);
    return map(registro);
  }
}
