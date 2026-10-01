import { Equipe, CriarEquipe } from "../types/equipe";
import { execute, query, queryOne } from "../database/query";

interface EquipeRow {
  ID: number;
  EVENTO_ID: number;
  NOME: string;
}

function objetoRetornoBanco(resposta: EquipeRow | null) {
  if (resposta === null) {
    return null;
  }

  return {
    id: resposta.ID,
    idEvento: resposta.EVENTO_ID,
    nome: resposta.NOME,
  };
}

export class EquipeRepository {
  async listar(): Promise<Equipe[]> {
    const registros = await query<EquipeRow>(`
        SELECT *
        FROM EQUIPE
        ORDER BY ID
      `);

    return registros.map((registro) => ({
      id: registro.ID,
      idEvento: registro.EVENTO_ID,
      nome: registro.NOME,
    }));
  }

  async buscarPorId(id: number): Promise<Equipe | null> {
    const registro = await queryOne<EquipeRow>(
      `
        SELECT *
        FROM EQUIPE
        WHERE ID = ?
      `,
      [id],
    );

    const objeto = objetoRetornoBanco(registro);
    return objeto;
  }

  async criar(dados: CriarEquipe): Promise<Equipe | null> {
    const resultado = await execute(
      `
        INSERT INTO EQUIPE (
          EVENTO_ID,
          NOME
        ) VALUES (?, ?)
      `,
      [dados.idEvento, dados.nome],
    );
    const registro = await queryOne<EquipeRow>(
      `SELECT * FROM EQUIPE WHERE ID = ?`,
      [resultado.insertId],
    );
    if (!registro) {
      throw new Error("Equipe não foi retornada após a criação");
    }

    return objetoRetornoBanco(registro);
  }

  async alterar(id: number, dados: CriarEquipe): Promise<Equipe | null> {
    const resultado = await execute(
      `
        UPDATE EQUIPE
        SET
          EVENTO_ID = ?,
          NOME = ?
        WHERE ID = ?
      `,
      [dados.idEvento, dados.nome, id],
    );
    if (resultado.affectedRows === 0) return null;
    const registro = await queryOne<EquipeRow>(
      `SELECT * FROM EQUIPE WHERE ID = ?`,
      [id],
    );
    return objetoRetornoBanco(registro);
  }
}
