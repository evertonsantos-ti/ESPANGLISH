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
