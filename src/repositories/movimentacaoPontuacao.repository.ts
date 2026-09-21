import { query, queryOne } from "../database/query";
import { MovimentacaoPontuacao, CriarMovimentacaoPontuacao } from "../types/movimentacaoPontuacao";

interface Row {
  ID: number;
  EVENTO_ID: number;
  EQUIPE_ID: number;
  TIPO: string;
  DESCRICAO: string;
  PONTOS: number;
  DATA_LANCAMENTO: Date;
}

export class MovimentacaoPontuacaoRepository {
  async listar(): Promise<MovimentacaoPontuacao[]> {
    const registros = await query<Row>(`SELECT ID, EVENTO_ID, EQUIPE_ID, TIPO, DESCRICAO, PONTOS, DATA_LANCAMENTO FROM MOVIMENTACAO_PONTUACAO ORDER BY ID`);
    return registros.map((r) => ({
      id: r.ID,
      idEvento: r.EVENTO_ID,
      idEquipe: r.EQUIPE_ID,
      tipo: r.TIPO,
      descricao: r.DESCRICAO,
      pontos: r.PONTOS,
      dataLancamento: r.DATA_LANCAMENTO,
    }));
  }

  async buscarPorId(id: number): Promise<MovimentacaoPontuacao | null> {
    const registro = await queryOne<Row>(`SELECT * FROM MOVIMENTACAO_PONTUACAO WHERE ID = ?`, [id]);
    if (!registro) return null;
    return {
      id: registro.ID,
      idEvento: registro.EVENTO_ID,
      idEquipe: registro.EQUIPE_ID,
      tipo: registro.TIPO,
      descricao: registro.DESCRICAO,
      pontos: registro.PONTOS,
      dataLancamento: registro.DATA_LANCAMENTO,
    };
  }

  async criar(dados: CriarMovimentacaoPontuacao): Promise<MovimentacaoPontuacao> {
    const registro = await queryOne<Row>(
      `
      INSERT INTO MOVIMENTACAO_PONTUACAO (EVENTO_ID, EQUIPE_ID, TIPO, DESCRICAO, PONTOS)
      VALUES (?, ?, ?, ?, ?)
      RETURNING ID, EVENTO_ID, EQUIPE_ID, TIPO, DESCRICAO, PONTOS, DATA_LANCAMENTO
    `,
      [dados.idEvento, dados.idEquipe, dados.tipo, dados.descricao, dados.pontos],
    );

    if (!registro) throw new Error("Movimentação não foi retornada após a criação");

    return {
      id: registro.ID,
      idEvento: registro.EVENTO_ID,
      idEquipe: registro.EQUIPE_ID,
      tipo: registro.TIPO,
      descricao: registro.DESCRICAO,
      pontos: registro.PONTOS,
      dataLancamento: registro.DATA_LANCAMENTO,
    };
  }
}
