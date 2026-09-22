import { JuradoCategoriaRepository } from "../repositories/juradoCategoria.repository";
import {
  JuradoCategoria,
  CriarJuradoCategoria,
} from "../types/juradoCategoria";
import { NotFoundError } from "../utils/error";

export class JuradoCategoriaService {
  constructor(private readonly repository: JuradoCategoriaRepository) {}

  async listar(): Promise<JuradoCategoria[]> {
    return this.repository.listar();
  }

  async buscarPorId(id: number): Promise<JuradoCategoria | null> {
    return this.repository.buscarPorId(id);
  }

  async criar(dados: CriarJuradoCategoria): Promise<JuradoCategoria> {
    return this.repository.criar(dados);
  }
}
