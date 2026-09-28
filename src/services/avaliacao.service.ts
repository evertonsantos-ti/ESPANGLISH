import { AvaliacaoRepository } from "../repositories/avaliacao.repository";
import { Avaliacao, CriarAvaliacao } from "../types/avaliacao";
import { NotFoundError, ValidationError } from "../utils/error";

export class AvaliacaoService {
  constructor(private readonly repository: AvaliacaoRepository) {}

  async listar(): Promise<Avaliacao[]> {
    return this.repository.listar();
  }

  async buscarPorId(id: number): Promise<Avaliacao | null> {
    return this.repository.buscarPorId(id);
  }

  async buscarPorJurado(
    idJurado: number,
    eventoId: number,
  ): Promise<Avaliacao[]> {
    return this.repository.buscarPorJurado(idJurado, eventoId);
  }

  async criar(dados: CriarAvaliacao): Promise<Avaliacao> {
    if (!(await this.repository.relacionamentosValidos(dados))) {
      throw new ValidationError(
        "A equipe, a categoria e o jurado devem pertencer ao mesmo evento; a categoria também deve estar atribuída ao jurado.",
      );
    }
    return this.repository.criar(dados);
  }
}
