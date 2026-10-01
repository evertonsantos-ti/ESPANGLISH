import { execute, query, queryOne } from "../database/query";
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
      ativo: Boolean(r.ATIVO),
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
      ativo: Boolean(registro.ATIVO),
    };
  }

  async buscarPorJurado(
    idJurado: number,
    eventoId: number,
  ): Promise<Criterio[]> {
    const registros = await query<CriterioRow>(
      `
        SELECT CR.ID, CR.CATEGORIA_ID, CR.NOME, CR.ORDEM, CR.ATIVO
        FROM CRITERIO CR
        INNER JOIN CATEGORIA CA ON CA.ID = CR.CATEGORIA_ID
        INNER JOIN JURADO_CATEGORIA JC ON JC.CATEGORIA_ID = CA.ID
        WHERE JC.JURADO_ID = ?
          AND CA.EVENTO_ID = ?
          AND CA.ATIVO = TRUE
          AND CR.ATIVO = TRUE
        ORDER BY CA.ORDEM, CR.ORDEM, CR.ID
      `,
      [idJurado, eventoId],
    );

    return registros.map((r) => ({
      id: r.ID,
      idCategoria: r.CATEGORIA_ID,
      nome: r.NOME,
      ordem: r.ORDEM,
      ativo: Boolean(r.ATIVO),
    }));
  }

  async criar(dados: CriarCriterio): Promise<Criterio> {
    const resultado = await execute(
      `
      INSERT INTO CRITERIO (CATEGORIA_ID, NOME, ORDEM, ATIVO)
      VALUES (?, ?, ?, TRUE)
    `,
      [dados.idCategoria, dados.nome, dados.ordem],
    );
    const registro = await queryOne<CriterioRow>(
      `SELECT * FROM CRITERIO WHERE ID = ?`,
      [resultado.insertId],
    );

    if (!registro) throw new Error("Critério não foi retornado após a criação");

    return {
      id: registro.ID,
      idCategoria: registro.CATEGORIA_ID,
      nome: registro.NOME,
      ordem: registro.ORDEM,
      ativo: Boolean(registro.ATIVO),
    };
  }

  async alterar(
    id: number,
    dados: AtualizarCriterio,
  ): Promise<Criterio | null> {
    const resultado = await execute(
      `
      UPDATE CRITERIO
      SET CATEGORIA_ID = ?, NOME = ?, ORDEM = ?, ATIVO = ?
      WHERE ID = ?
    `,
      [dados.idCategoria, dados.nome, dados.ordem, dados.ativo, id],
    );
    if (resultado.affectedRows === 0) return null;
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
      ativo: Boolean(registro.ATIVO),
    };
  }
}
