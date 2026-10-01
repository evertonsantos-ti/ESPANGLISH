import { execute, query, queryOne } from "../database/query";
import { Jurado, CriarJurado, AtualizarJurado } from "../types/jurado";

interface JuradoRow {
  ID: number;
  EVENTO_ID: number;
  NOME: string;
  LOGIN: string;
  ATIVO: boolean;
}

export class JuradoRepository {
  async listar(): Promise<Jurado[]> {
    const registros = await query<JuradoRow>(`
      SELECT ID, EVENTO_ID, NOME, LOGIN, ATIVO
      FROM JURADO
      ORDER BY ID
    `);

    return registros.map((r) => ({
      id: r.ID,
      idEvento: r.EVENTO_ID,
      nome: r.NOME,
      login: r.LOGIN,
      ativo: Boolean(r.ATIVO),
    }));
  }

  async buscarPorId(id: number): Promise<Jurado | null> {
    const registro = await queryOne<JuradoRow>(
      `SELECT * FROM JURADO WHERE ID = ?`,
      [id],
    );
    if (!registro) return null;
    return {
      id: registro.ID,
      idEvento: registro.EVENTO_ID,
      nome: registro.NOME,
      login: registro.LOGIN,
      ativo: Boolean(registro.ATIVO),
    };
  }

  async criar(dados: CriarJurado): Promise<Jurado> {
    const resultado = await execute(
      `
      INSERT INTO JURADO (EVENTO_ID, NOME, LOGIN, ATIVO)
      VALUES (?, ?, ?, TRUE)
    `,
      [dados.idEvento, dados.nome, dados.login],
    );
    const registro = await queryOne<JuradoRow>(
      `SELECT * FROM JURADO WHERE ID = ?`,
      [resultado.insertId],
    );

    if (!registro) throw new Error("Jurado não foi retornado após a criação");

    return {
      id: registro.ID,
      idEvento: registro.EVENTO_ID,
      nome: registro.NOME,
      login: registro.LOGIN,
      ativo: Boolean(registro.ATIVO),
    };
  }

  async alterar(id: number, dados: AtualizarJurado): Promise<Jurado | null> {
    const resultado = await execute(
      `
      UPDATE JURADO
      SET EVENTO_ID = ?, NOME = ?, LOGIN = ?, ATIVO = ?
      WHERE ID = ?
    `,
      [dados.idEvento, dados.nome, dados.login, dados.ativo, id],
    );
    if (resultado.affectedRows === 0) return null;
    const registro = await queryOne<JuradoRow>(
      `SELECT * FROM JURADO WHERE ID = ?`,
      [id],
    );

    if (!registro) return null;
    return {
      id: registro.ID,
      idEvento: registro.EVENTO_ID,
      nome: registro.NOME,
      login: registro.LOGIN,
      ativo: Boolean(registro.ATIVO),
    };
  }

  async buscarParaLogin(
    login: string,
    eventoId: number,
  ): Promise<Jurado | null> {
    const registro = await queryOne<JuradoRow>(
      `
      SELECT ID, EVENTO_ID, NOME, LOGIN, ATIVO
      FROM JURADO
      WHERE LOGIN = ?
        AND EVENTO_ID = ?
        AND ATIVO = TRUE
      `,
      [login, eventoId],
    );

    if (!registro) return null;
    return {
      id: registro.ID,
      idEvento: registro.EVENTO_ID,
      nome: registro.NOME,
      login: registro.LOGIN,
      ativo: Boolean(registro.ATIVO),
    };
  }
}
