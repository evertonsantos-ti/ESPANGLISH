import { query, queryOne } from "../database/query";
import { Usuario, CriarUsuario } from "../types/usuario";

interface UsuarioRow {
  ID: number;
  DATA_CRIACAO: string;
  NOME: string;
  SENHA_HASH: string;
}

export class UsuarioRepository {
  async listar(): Promise<Usuario[]> {
    const registros = await query<UsuarioRow>(`
      SELECT ID, DATA_CRIACAO, NOME, SENHA_HASH
      FROM USUARIO
      ORDER BY ID
    `);

    return registros.map((r) => ({
      id: r.ID,
      dataCriacao: new Date(r.DATA_CRIACAO),
      nome: r.NOME,
      senhaHash: r.SENHA_HASH,
    }));
  }

  async buscarPorId(id: number): Promise<Usuario | null> {
    const registro = await queryOne<UsuarioRow>(`SELECT * FROM USUARIO WHERE ID = ?`, [
      id,
    ]);
    if (!registro) return null;
    return {
      id: registro.ID,
      dataCriacao: new Date(registro.DATA_CRIACAO),
      nome: registro.NOME,
      senhaHash: registro.SENHA_HASH,
    };
  }

  async criar(dados: CriarUsuario): Promise<Usuario> {
    const registro = await queryOne<UsuarioRow>(
      `
      INSERT INTO USUARIO (DATA_CRIACAO, NOME, SENHA_HASH)
      VALUES (CURRENT_TIMESTAMP, ?, ?)
      RETURNING ID, DATA_CRIACAO, NOME, SENHA_HASH
    `,
      [dados.nome, dados.senhaHash],
    );

    if (!registro) throw new Error("Usuário não foi retornado após a criação");

    return {
      id: registro.ID,
      dataCriacao: new Date(registro.DATA_CRIACAO),
      nome: registro.NOME,
      senhaHash: registro.SENHA_HASH,
    };
  }

  async alterar(id: number, dados: AtualizarUsuario): Promise<Usuario | null> {
    const registro = await queryOne<UsuarioRow>(
      `
      UPDATE USUARIO
      SET NOME = ?, SENHA_HASH = ?
      WHERE ID = ?
      RETURNING ID, DATA_CRIACAO, NOME, SENHA_HASH
    `,
      [dados.nome, dados.senhaHash, id],
    );

    if (!registro) return null;
    return {
      id: registro.ID,
      dataCriacao: new Date(registro.DATA_CRIACAO),
      nome: registro.NOME,
      senhaHash: registro.SENHA_HASH,
    };
  }

  async deletar(id: number): Promise<void> {
    await query(`DELETE FROM USUARIO WHERE ID = ?`, [id]);
  }
}
