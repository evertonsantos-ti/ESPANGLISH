import { query, queryOne } from "../database/query";
import {
  JuradoCategoria,
  CriarJuradoCategoria,
} from "../types/juradoCategoria";

interface Row {
  ID: number;
  JURADO_ID: number;
  CATEGORIA_ID: number;
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

  async criar(dados: CriarJuradoCategoria): Promise<JuradoCategoria> {
    const registro = await queryOne<Row>(
      `
      INSERT INTO JURADO_CATEGORIA (JURADO_ID, CATEGORIA_ID)
      VALUES (?, ?)
      RETURNING ID, JURADO_ID, CATEGORIA_ID
    `,
      [dados.idJurado, dados.idCategoria],
    );

    if (!registro)
      throw new Error(
        "Associação jurado-categoria não foi retornada após a criação",
      );

    return mapRow(registro) as JuradoCategoria;
  }
}
