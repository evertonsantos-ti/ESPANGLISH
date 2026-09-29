import { JuradoCategoriaRepository } from "../repositories/juradoCategoria.repository";
import {
  JuradoCategoria,
  CriarJuradoCategoria,
} from "../types/juradoCategoria";
import { NotFoundError, ValidationError } from "../utils/error";

export class JuradoCategoriaService {
  constructor(private readonly repository: JuradoCategoriaRepository) {}

  async listar(): Promise<JuradoCategoria[]> {
    return this.repository.listar();
  }

  async buscarPorId(id: number): Promise<JuradoCategoria | null> {
    return this.repository.buscarPorId(id);
  }

  async criar(dados: CriarJuradoCategoria): Promise<JuradoCategoria> {
    const vinculacao = await this.repository.criarComAvaliacoes(dados);
    if (!vinculacao) {
      throw new ValidationError(
        "O jurado e a categoria devem pertencer ao mesmo evento e estar ativos.",
      );
    }
    return vinculacao;
  }

  async deletar(id: number): Promise<void> {
    if (!(await this.repository.deletar(id))) {
      throw new NotFoundError("Não há atribuição com este (ID)!");
    }
  }
}
