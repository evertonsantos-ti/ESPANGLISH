import { CriterioRepository } from "../repositories/criterio.repository";
import { Criterio, CriarCriterio, AtualizarCriterio } from "../types/criterio";
import { NotFoundError } from "../utils/error";

export class CriterioService {
  constructor(private readonly repository: CriterioRepository) {}

  async listar(): Promise<Criterio[]> {
    return this.repository.listar();
  }

  async buscarPorId(id: number): Promise<Criterio | null> {
    return this.repository.buscarPorId(id);
  }

  async criar(dados: CriarCriterio): Promise<Criterio> {
    return this.repository.criar(dados);
  }

  async alterar(id: number, dados: AtualizarCriterio): Promise<Criterio | null> {
    const criterio = await this.repository.alterar(id, dados);
    if (!criterio) throw new NotFoundError("Não há critério com este (ID)!");
    return criterio;
  }
}
