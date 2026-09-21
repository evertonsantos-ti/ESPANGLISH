import { AvaliacaoRepository } from "../repositories/avaliacao.repository";
import { Avaliacao, CriarAvaliacao } from "../types/avaliacao";
import { NotFoundError } from "../utils/error";

export class AvaliacaoService {
  constructor(private readonly repository: AvaliacaoRepository) {}

  async listar(): Promise<Avaliacao[]> {
    return this.repository.listar();
  }

  async buscarPorId(id: number): Promise<Avaliacao | null> {
    return this.repository.buscarPorId(id);
  }

  async criar(dados: CriarAvaliacao): Promise<Avaliacao> {
    return this.repository.criar(dados);
  }
}
