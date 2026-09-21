import { query, queryOne } from "../database/query";
import { Criterio, CriarCriterio, AtualizarCriterio } from "../types/criterio";

interface CriterioRow {
  ID: number;
  CATEGORIA_ID: number;
  NOME: string;
  ORDEM: number;
  ATIVO: boolean;
}

export class CriterioRepository {
  async listar(): Promise<Criterio[]> {
    const registros = await query<CriterioRow>(`
      SELECT ID, CATEGORIA_ID, NOME, ORDEM, ATIVO
      FROM CRITERIO
      ORDER BY ID
    `);

    return registros.map((r) => ({
      id: r.ID,
      idCategoria: r.CATEGORIA_ID,
      nome: r.NOME,
      ordem: r.ORDEM,
      ativo: r.ATIVO,
    }));
  }

  async buscarPorId(id: number): Promise<Criterio | null> {
    const registro = await queryOne<CriterioRow>(
      `SELECT * FROM CRITERIO WHERE ID = ?`,
      [id],
    );
    if (!registro) return null;
    return {
      id: registro.ID,
      idCategoria: registro.CATEGORIA_ID,
      nome: registro.NOME,
      ordem: registro.ORDEM,
      ativo: registro.ATIVO,
    };
  }

  async criar(dados: CriarCriterio): Promise<Criterio> {
    const registro = await queryOne<CriterioRow>(
      `
      INSERT INTO CRITERIO (CATEGORIA_ID, NOME, ORDEM, ATIVO)
      VALUES (?, ?, ?, TRUE)
      RETURNING ID, CATEGORIA_ID, NOME, ORDEM, ATIVO
    `,
      [dados.idCategoria, dados.nome, dados.ordem],
    );

    if (!registro) throw new Error("Critério não foi retornado após a criação");

    return {
      id: registro.ID,
      idCategoria: registro.CATEGORIA_ID,
      nome: registro.NOME,
      ordem: registro.ORDEM,
      ativo: registro.ATIVO,
    };
  }

  async alterar(
    id: number,
    dados: AtualizarCriterio,
  ): Promise<Criterio | null> {
    const registro = await queryOne<CriterioRow>(
      `
      UPDATE CRITERIO
      SET CATEGORIA_ID = ?, NOME = ?, ORDEM = ?, ATIVO = ?
      WHERE ID = ?
      RETURNING *
    `,
      [dados.idCategoria, dados.nome, dados.ordem, dados.ativo, id],
    );

    if (!registro) return null;
    return {
      id: registro.ID,
      idCategoria: registro.CATEGORIA_ID,
      nome: registro.NOME,
      ordem: registro.ORDEM,
      ativo: registro.ATIVO,
    };
  }
}
