import { CategoriaRepository } from "../repositories/categoria.repository";
import {
  Categoria,
  CriarCategoria,
  AtualizarCategoria,
} from "../types/categoria";
import { NotFoundError } from "../utils/error";

export class CategoriaService {
  constructor(private readonly repository: CategoriaRepository) {}

  async listar(): Promise<Categoria[]> {
    return this.repository.listar();
  }

  async buscarPorId(id: number): Promise<Categoria | null> {
    return this.repository.buscarPorId(id);
  }

  async criar(dados: CriarCategoria): Promise<Categoria> {
    return this.repository.criar(dados);
  }

  async alterar(
    id: number,
    dados: AtualizarCategoria,
  ): Promise<Categoria | null> {
    const categoria = await this.repository.alterar(id, dados);
    if (!categoria) throw new NotFoundError("Não há categoria com este (ID)!");
    return categoria;
  }
}
