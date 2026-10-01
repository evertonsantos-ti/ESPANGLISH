import { execute, query, queryOne } from "../database/query";
import {
  Categoria,
  CriarCategoria,
  AtualizarCategoria,
} from "../types/categoria";

interface CategoriaRow {
  ID: number;
  EVENTO_ID: number;
  NOME: string;
  ORDEM: number;
  ATIVO: boolean;
}

export class CategoriaRepository {
  async listar(): Promise<Categoria[]> {
    const registros = await query<CategoriaRow>(`
      SELECT ID, EVENTO_ID, NOME, ORDEM, ATIVO
      FROM CATEGORIA
      ORDER BY ORDEM
    `);

    return registros.map((r) => ({
      id: r.ID,
      idEvento: r.EVENTO_ID,
      nome: r.NOME,
      ordem: r.ORDEM,
      ativo: Boolean(r.ATIVO),
    }));
  }

  async buscarPorId(id: number): Promise<Categoria | null> {
    const registro = await queryOne<CategoriaRow>(
      `SELECT * FROM CATEGORIA WHERE ID = ?`,
      [id],
    );

    if (!registro) return null;
    return {
      id: registro.ID,
      idEvento: registro.EVENTO_ID,
      nome: registro.NOME,
      ordem: registro.ORDEM,
      ativo: Boolean(registro.ATIVO),
    };
  }

  async buscarPorJurado(
    idJurado: number,
    eventoId: number,
  ): Promise<Categoria[]> {
    const registros = await query<CategoriaRow>(
      `
        SELECT C.*
        FROM CATEGORIA C
        INNER JOIN JURADO_CATEGORIA JC
          ON JC.CATEGORIA_ID = C.ID
        WHERE JC.JURADO_ID = ?
        AND C.EVENTO_ID = ?
        AND C.ATIVO = TRUE
        ORDER BY C.ORDEM, C.ID
      `,
      [idJurado, eventoId],
    );

    return registros.map((r) => ({
      id: r.ID,
      idEvento: r.EVENTO_ID,
      nome: r.NOME,
      ordem: r.ORDEM,
      ativo: Boolean(r.ATIVO),
    }));
  }
  async buscarPorIdJurado(
    idCategoria: number,
    idJurado: number,
    eventoId: number,
  ): Promise<Categoria | null> {
    const registro = await queryOne<CategoriaRow>(
      `
        SELECT C.*
        FROM CATEGORIA C
        INNER JOIN JURADO_CATEGORIA JC
          ON JC.CATEGORIA_ID = C.ID
        WHERE C.ID = ?
          AND JC.JURADO_ID = ?
          AND C.EVENTO_ID = ?
      `,
      [idCategoria, idJurado, eventoId],
    );

    if (!registro) return null;
    return {
      id: registro.ID,
      idEvento: registro.EVENTO_ID,
      nome: registro.NOME,
      ordem: registro.ORDEM,
      ativo: Boolean(registro.ATIVO),
    };
  }

  async criar(dados: CriarCategoria): Promise<Categoria> {
    const resultado = await execute(
      `
      INSERT INTO CATEGORIA (EVENTO_ID, NOME, ORDEM, ATIVO)
      VALUES (?, ?, ?, TRUE)
    `,
      [dados.idEvento, dados.nome, dados.ordem],
    );
    const registro = await queryOne<CategoriaRow>(
      `SELECT * FROM CATEGORIA WHERE ID = ?`,
      [resultado.insertId],
    );

    if (!registro)
      throw new Error("Categoria não foi retornada após a criação");

    return {
      id: registro.ID,
      idEvento: registro.EVENTO_ID,
      nome: registro.NOME,
      ordem: registro.ORDEM,
      ativo: Boolean(registro.ATIVO),
    };
  }

  async alterar(
    id: number,
    dados: AtualizarCategoria,
  ): Promise<Categoria | null> {
    const resultado = await execute(
      `
      UPDATE CATEGORIA
      SET EVENTO_ID = ?, NOME = ?, ORDEM = ?, ATIVO = ?
      WHERE ID = ?
    `,
      [dados.idEvento, dados.nome, dados.ordem, dados.ativo, id],
    );
    if (resultado.affectedRows === 0) return null;
    const registro = await queryOne<CategoriaRow>(
      `SELECT * FROM CATEGORIA WHERE ID = ?`,
      [id],
    );

    if (!registro) return null;

    return {
      id: registro.ID,
      idEvento: registro.EVENTO_ID,
      nome: registro.NOME,
      ordem: registro.ORDEM,
      ativo: Boolean(registro.ATIVO),
    };
  }
}
