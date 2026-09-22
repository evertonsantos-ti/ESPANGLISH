import { MovimentacaoPontuacaoRepository } from "../repositories/movimentacaoPontuacao.repository";
import {
  MovimentacaoPontuacao,
  CriarMovimentacaoPontuacao,
} from "../types/movimentacaoPontuacao";
import { NotFoundError } from "../utils/error";

export class MovimentacaoPontuacaoService {
  constructor(private readonly repository: MovimentacaoPontuacaoRepository) {}

  async listar(): Promise<MovimentacaoPontuacao[]> {
    return this.repository.listar();
  }

  async buscarPorId(id: number): Promise<MovimentacaoPontuacao | null> {
    return this.repository.buscarPorId(id);
  }

  async criar(
    dados: CriarMovimentacaoPontuacao,
  ): Promise<MovimentacaoPontuacao> {
    return this.repository.criar(dados);
  }
}
