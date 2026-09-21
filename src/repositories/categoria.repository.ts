import { query, queryOne } from "../database/query";
import { Categoria, CriarCategoria, AtualizarCategoria } from "../types/categoria";

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
      ORDER BY ID
    `);

    return registros.map((r) => ({
      id: r.ID,
      idEvento: r.EVENTO_ID,
      nome: r.NOME,
      ordem: r.ORDEM,
      ativo: r.ATIVO,
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
      ativo: registro.ATIVO,
    };
  }

  async criar(dados: CriarCategoria): Promise<Categoria> {
    const registro = await queryOne<CategoriaRow>(
      `
      INSERT INTO CATEGORIA (EVENTO_ID, NOME, ORDEM, ATIVO)
      VALUES (?, ?, ?, TRUE)
      RETURNING ID, EVENTO_ID, NOME, ORDEM, ATIVO
    `,
      [dados.idEvento, dados.nome, dados.ordem],
    );

    if (!registro) throw new Error("Categoria não foi retornada após a criação");

    return {
      id: registro.ID,
      idEvento: registro.EVENTO_ID,
      nome: registro.NOME,
      ordem: registro.ORDEM,
      ativo: registro.ATIVO,
    };
  }

  async alterar(id: number, dados: AtualizarCategoria): Promise<Categoria | null> {
    const registro = await queryOne<CategoriaRow>(
      `
      UPDATE CATEGORIA
      SET EVENTO_ID = ?, NOME = ?, ORDEM = ?, ATIVO = ?
      WHERE ID = ?
      RETURNING *
    `,
      [dados.idEvento, dados.nome, dados.ordem, dados.ativo, id],
    );

    if (!registro) return null;

    return {
      id: registro.ID,
      idEvento: registro.EVENTO_ID,
      nome: registro.NOME,
      ordem: registro.ORDEM,
      ativo: registro.ATIVO,
    };
  }
}
