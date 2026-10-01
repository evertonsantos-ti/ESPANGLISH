import { execute, query, queryOne } from "../database/query";
import { Evento, CriarEvento, AtualizarEvento } from "../types/evento";

interface EventoRow {
  ID: number;
  NOME: string;
  COMPETENCIA: number;
  DATA_INICIO: Date;
  DATA_FIM: Date;
  ATIVO: boolean;
}

export class EventoRepository {
  async listar(): Promise<Evento[]> {
    const registros = await query<EventoRow>(`
            SELECT
                ID,
                NOME,
                COMPETENCIA,
                DATA_INICIO,
                DATA_FIM,
                ATIVO
            FROM EVENTO
            ORDER BY ID
        `);

    return registros.map((registro) => ({
      id: registro.ID,
      nome: registro.NOME,
      competencia: registro.COMPETENCIA,
      dataInicio: registro.DATA_INICIO,
      dataFim: registro.DATA_FIM,
      ativo: Boolean(registro.ATIVO),
    }));
  }

  async buscarPorId(id: number): Promise<Evento | null> {
    const registro = await queryOne<EventoRow>(
      `
      SELECT *
        FROM EVENTO
        WHERE ID = ?`,
      [id],
    );
    if (registro === null) {
      return null;
    }

    return {
      id: registro.ID,
      nome: registro.NOME,
      competencia: registro.COMPETENCIA,
      dataInicio: registro.DATA_INICIO,
      dataFim: registro.DATA_FIM,
      ativo: Boolean(registro.ATIVO),
    };
  }

  async criar(dados: CriarEvento): Promise<Evento> {
    const resultado = await execute(
      `
        INSERT INTO EVENTO (
          NOME,
          COMPETENCIA,
          DATA_INICIO,
          DATA_FIM,
          ATIVO
        ) VALUES (?, ?, ?, ?, TRUE)
      `,
      [dados.nome, dados.competencia, dados.dataInicio, dados.dataFim],
    );
    const registro = await queryOne<EventoRow>(
      `SELECT * FROM EVENTO WHERE ID = ?`,
      [resultado.insertId],
    );
    if (!registro) {
      throw new Error("Evento não foi retornado após a criação");
    }
    return {
      id: registro.ID,
      nome: registro.NOME,
      competencia: registro.COMPETENCIA,
      dataInicio: registro.DATA_INICIO,
      dataFim: registro.DATA_FIM,
      ativo: Boolean(registro.ATIVO),
    };
  }

  async alterar(id: number, dados: AtualizarEvento): Promise<Evento | null> {
    const resultado = await execute(
      `
      UPDATE EVENTO
      SET
        NOME = ?,
        COMPETENCIA = ?,
        DATA_INICIO = ?, 
        DATA_FIM = ?, 
        ATIVO =? 
      WHERE ID = ?
      `,
      [
        dados.nome,
        dados.competencia,
        dados.dataInicio,
        dados.dataFim,
        dados.ativo,
        id,
      ],
    );
    if (resultado.affectedRows === 0) return null;
    const registro = await queryOne<EventoRow>(
      `SELECT * FROM EVENTO WHERE ID = ?`,
      [id],
    );
    if (!registro) {
      return null;
    }
    return {
      id: registro.ID,
      nome: registro.NOME,
      competencia: registro.COMPETENCIA,
      dataInicio: registro.DATA_INICIO,
      dataFim: registro.DATA_FIM,
      ativo: Boolean(registro.ATIVO),
    };
  }

  async inativarEventosVencidos(): Promise<void> {
    await execute(`CALL INATIVAR_EVENTOS_VENCIDOS();`);
  }
}
