import { query, queryOne } from "../database/query";
import { Evento, CriarEvento } from "../types/evento";

interface EventoRow {
  ID: number;
  NOME: string;
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
                DATA_INICIO,
                DATA_FIM,
                ATIVO
            FROM EVENTO
            ORDER BY ID
        `);

    return registros.map((registro) => ({
      id: registro.ID,
      nome: registro.NOME,
      dataInicio: registro.DATA_INICIO,
      dataFim: registro.DATA_FIM,
      ativo: registro.ATIVO,
    }));
  }

  async criar(dados: CriarEvento): Promise<Evento> {
    const registro = await queryOne<EventoRow>(
      `
        INSERT INTO EVENTO (
          NOME,
          DATA_INICIO,
          DATA_FIM,
          ATIVO
        ) VALUES (?, ?, ?, TRUE)
         RETURNING
          ID,
          NOME,
          DATA_INICIO,
          DATA_FIM,
          ATIVO
      `,
      [dados.nome, dados.dataInicio, dados.dataFim],
    );

    if (!registro) {
      throw new Error("Evento não foi retornado após a criação");
    }
    return {
      id: registro.ID,
      nome: registro.NOME,
      dataInicio: registro.DATA_INICIO,
      dataFim: registro.DATA_FIM,
      ativo: registro.ATIVO,
    };
  }
}
