import { EquipeRepository } from "../repositories/equipe.repository";
import { CriarEquipe, Equipe } from "../types/equipe";
import { NotFoundError } from "../utils/error";

export class EquipeService {
  constructor(private readonly repository: EquipeRepository) {}

  async listar(): Promise<Equipe[]> {
    return this.repository.listar();
  }

  async buscarPorId(id: number): Promise<Equipe | null> {
    return this.repository.buscarPorId(id);
  }

  async criar(dados: CriarEquipe): Promise<Equipe | null> {
    return this.repository.criar(dados);
  }

  async alterar(id: number, dados: CriarEquipe): Promise<Equipe | null> {
    const equipe = await this.repository.alterar(id, dados);

    if (!equipe) {
      throw new NotFoundError("Não há equipe com este (ID)!");
    }
    return equipe;
  }
}
