import { query, queryOne } from "../database/query";
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
      ativo: r.ATIVO,
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
      ativo: registro.ATIVO,
    };
  }

  async criar(dados: CriarJurado): Promise<Jurado> {
    const registro = await queryOne<JuradoRow>(
      `
      INSERT INTO JURADO (EVENTO_ID, NOME, LOGIN, ATIVO)
      VALUES (?, ?, ?, TRUE)
      RETURNING ID, EVENTO_ID, NOME, LOGIN, ATIVO
    `,
      [dados.idEvento, dados.nome, dados.login],
    );

    if (!registro) throw new Error("Jurado não foi retornado após a criação");

    return {
      id: registro.ID,
      idEvento: registro.EVENTO_ID,
      nome: registro.NOME,
      login: registro.LOGIN,
      ativo: registro.ATIVO,
    };
  }

  async alterar(id: number, dados: AtualizarJurado): Promise<Jurado | null> {
    const registro = await queryOne<JuradoRow>(
      `
      UPDATE JURADO
      SET EVENTO_ID = ?, NOME = ?, LOGIN = ?, ATIVO = ?
      WHERE ID = ?
      RETURNING *
    `,
      [dados.idEvento, dados.nome, dados.login, dados.ativo, id],
    );

    if (!registro) return null;
    return {
      id: registro.ID,
      idEvento: registro.EVENTO_ID,
      nome: registro.NOME,
      login: registro.LOGIN,
      ativo: registro.ATIVO,
    };
  }
}
