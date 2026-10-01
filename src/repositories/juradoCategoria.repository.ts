import { query, queryOne, withTransaction } from "../database/query";
import {
  JuradoCategoria,
  CriarJuradoCategoria,
} from "../types/juradoCategoria";

interface Row {
  ID: number;
  JURADO_ID: number;
  CATEGORIA_ID: number;
}

interface EventoRow {
  EVENTO_ID: number;
}

function mapRow(r: Row | null): JuradoCategoria | null {
  if (!r) return null;
  return {
    id: r.ID,
    idJurado: r.JURADO_ID,
    idCategoria: r.CATEGORIA_ID,
  };
}

export class JuradoCategoriaRepository {
  async listar(): Promise<JuradoCategoria[]> {
    const registros = await query<Row>(
      `SELECT ID, JURADO_ID, CATEGORIA_ID FROM JURADO_CATEGORIA ORDER BY ID`,
    );
    return registros.map((r) => ({
      id: r.ID,
      idJurado: r.JURADO_ID,
      idCategoria: r.CATEGORIA_ID,
    }));
  }

  async buscarPorId(id: number): Promise<JuradoCategoria | null> {
    const registro = await queryOne<Row>(
      `SELECT * FROM JURADO_CATEGORIA WHERE ID = ?`,
      [id],
    );
    return mapRow(registro);
  }

  async criarComAvaliacoes(
    dados: CriarJuradoCategoria,
  ): Promise<JuradoCategoria | null> {
    return withTransaction(async (transaction) => {
          const evento = await transaction.queryOne<EventoRow>(
            `
              SELECT J.EVENTO_ID
              FROM JURADO J
              INNER JOIN CATEGORIA C ON C.EVENTO_ID = J.EVENTO_ID
              INNER JOIN EVENTO E ON E.ID = J.EVENTO_ID
              WHERE J.ID = ?
                AND C.ID = ?
                AND J.ATIVO = TRUE
                AND C.ATIVO = TRUE
                AND E.ATIVO = TRUE
            `,
            [dados.idJurado, dados.idCategoria],
          );
          if (!evento) return null;

          const resultado = await transaction.execute(
            `
              INSERT INTO JURADO_CATEGORIA (JURADO_ID, CATEGORIA_ID)
              VALUES (?, ?)
            `,
            [dados.idJurado, dados.idCategoria],
          );

          const registro = await transaction.queryOne<Row>(
            `
              SELECT ID, JURADO_ID, CATEGORIA_ID
              FROM JURADO_CATEGORIA
              WHERE ID = ?
            `,
            [resultado.insertId],
          );
          if (!registro) {
            throw new Error(
              "Associação jurado-categoria não foi retornada após a criação",
            );
          }

          await transaction.execute(
            `
              INSERT INTO AVALIACAO (EQUIPE_ID, CATEGORIA_ID, JURADO_ID)
              SELECT E.ID, ?, ?
              FROM EQUIPE E
              WHERE E.EVENTO_ID = ?
                AND NOT EXISTS (
                  SELECT 1
                  FROM AVALIACAO A
                  WHERE A.EQUIPE_ID = E.ID
                    AND A.CATEGORIA_ID = ?
                    AND A.JURADO_ID = ?
                )
            `,
            [
              dados.idCategoria,
              dados.idJurado,
              evento.EVENTO_ID,
              dados.idCategoria,
              dados.idJurado,
            ],
          );

          return mapRow(registro) as JuradoCategoria;
    });
  }

  async deletar(id: number): Promise<boolean> {
    return withTransaction(async (transaction) => {
          const vinculacao = await transaction.queryOne<Row>(
            `SELECT ID, JURADO_ID, CATEGORIA_ID FROM JURADO_CATEGORIA WHERE ID = ?`,
            [id],
          );
          if (!vinculacao) return false;

          await transaction.execute(
            `
              DELETE FROM NOTA
              WHERE AVALIACAO_ID IN (
                SELECT ID
                FROM AVALIACAO
                WHERE JURADO_ID = ? AND CATEGORIA_ID = ?
              )
            `,
            [vinculacao.JURADO_ID, vinculacao.CATEGORIA_ID],
          );
          await transaction.execute(
            `DELETE FROM AVALIACAO WHERE JURADO_ID = ? AND CATEGORIA_ID = ?`,
            [vinculacao.JURADO_ID, vinculacao.CATEGORIA_ID],
          );
          await transaction.execute(
            `DELETE FROM JURADO_CATEGORIA WHERE ID = ?`,
            [id],
          );
          return true;
    });
  }
}
