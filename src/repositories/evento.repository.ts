import { query } from "../database/query";
import { Evento } from "../types/evento";

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
}
