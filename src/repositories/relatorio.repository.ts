import { query } from "../database/query";

export interface LinhaRelatorio {
  equipeId: number;
  equipeNome: string;
  categoriaId: number;
  categoriaNome: string;
  categoriaOrdem: number;
  criterioId: number;
  criterioNome: string;
  criterioOrdem: number;
  totalNotas: number;
}

interface LinhaRelatorioRow {
  EQUIPE_ID: number;
  EQUIPE_NOME: string;
  CATEGORIA_ID: number;
  CATEGORIA_NOME: string;
  CATEGORIA_ORDEM: number;
  CRITERIO_ID: number;
  CRITERIO_NOME: string;
  CRITERIO_ORDEM: number;
  TOTAL_NOTAS: number;
}

export class RelatorioRepository {
  async listarPorEvento(eventoId: number): Promise<LinhaRelatorio[]> {
    const registros = await query<LinhaRelatorioRow>(
      `
        SELECT
          E.ID AS EQUIPE_ID,
          E.NOME AS EQUIPE_NOME,
          CA.ID AS CATEGORIA_ID,
          CA.NOME AS CATEGORIA_NOME,
          CA.ORDEM AS CATEGORIA_ORDEM,
          CR.ID AS CRITERIO_ID,
          CR.NOME AS CRITERIO_NOME,
          CR.ORDEM AS CRITERIO_ORDEM,
          COALESCE(SUM(N.NOTA), 0) AS TOTAL_NOTAS
        FROM EQUIPE E
        INNER JOIN CATEGORIA CA ON CA.EVENTO_ID = E.EVENTO_ID
        INNER JOIN CRITERIO CR ON CR.CATEGORIA_ID = CA.ID
        LEFT JOIN AVALIACAO A
          ON A.EQUIPE_ID = E.ID
          AND A.CATEGORIA_ID = CA.ID
        LEFT JOIN NOTA N
          ON N.AVALIACAO_ID = A.ID
          AND N.CRITERIO_ID = CR.ID
        WHERE E.EVENTO_ID = ?
        GROUP BY
          E.ID, E.NOME,
          CA.ID, CA.NOME, CA.ORDEM,
          CR.ID, CR.NOME, CR.ORDEM
        ORDER BY E.NOME, CA.ORDEM, CA.NOME, CR.ORDEM, CR.NOME
      `,
      [eventoId],
    );

    return registros.map((registro) => ({
      equipeId: registro.EQUIPE_ID,
      equipeNome: registro.EQUIPE_NOME,
      categoriaId: registro.CATEGORIA_ID,
      categoriaNome: registro.CATEGORIA_NOME,
      categoriaOrdem: registro.CATEGORIA_ORDEM,
      criterioId: registro.CRITERIO_ID,
      criterioNome: registro.CRITERIO_NOME,
      criterioOrdem: registro.CRITERIO_ORDEM,
      totalNotas: Number(registro.TOTAL_NOTAS),
    }));
  }
}
