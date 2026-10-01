import { execute, query, queryOne } from "../database/query";
import { Usuario, CriarUsuario, AtualizarUsuario } from "../types/usuario";

interface UsuarioRow {
  ID: number;
  NOME: string;
  SENHA_HASH: string;
}

function mapRow(registro: UsuarioRow): Usuario {
  return {
    id: registro.ID,
    nome: registro.NOME,
    senhaHash: registro.SENHA_HASH,
  };
}

export class UsuarioRepository {
  async listar(): Promise<Usuario[]> {
    const registros = await query<UsuarioRow>(`
      SELECT ID, NOME, SENHA_HASH
      FROM USUARIO
      ORDER BY ID
    `);

    return registros.map(mapRow);
  }

  async buscarPorId(id: number): Promise<Usuario | null> {
    const registro = await queryOne<UsuarioRow>(
      `SELECT * FROM USUARIO WHERE ID = ?`,
      [id],
    );
    return registro ? mapRow(registro) : null;
  }

  async criar(dados: CriarUsuario): Promise<Usuario> {
    const resultado = await execute(
      `
        INSERT INTO USUARIO (NOME, SENHA_HASH)
        VALUES (?, ?)
      `,
      [dados.nome, dados.senhaHash],
    );
    const registro = await queryOne<UsuarioRow>(
      `SELECT ID, NOME, SENHA_HASH FROM USUARIO WHERE ID = ?`,
      [resultado.insertId],
    );

    if (!registro) throw new Error("Usuário não foi retornado após a criação");
    return mapRow(registro);
  }

  async alterar(id: number, dados: AtualizarUsuario): Promise<Usuario | null> {
    const resultado = await execute(
      `
        UPDATE USUARIO
        SET NOME = ?, SENHA_HASH = ?
        WHERE ID = ?
      `,
      [dados.nome, dados.senhaHash, id],
    );
    if (resultado.affectedRows === 0) return null;

    const registro = await queryOne<UsuarioRow>(
      `SELECT ID, NOME, SENHA_HASH FROM USUARIO WHERE ID = ?`,
      [id],
    );
    return registro ? mapRow(registro) : null;
  }

  async deletar(id: number): Promise<void> {
    await execute(`DELETE FROM USUARIO WHERE ID = ?`, [id]);
  }

  async buscarPorNome(nome: string): Promise<Usuario | null> {
    const registro = await queryOne<UsuarioRow>(
      `
        SELECT ID, NOME, SENHA_HASH
        FROM USUARIO
        WHERE NOME = ?
      `,
      [nome],
    );
    return registro ? mapRow(registro) : null;
  }
}
