import { NotaRepository } from "../repositories/nota.repository";
import { Nota, CriarNota } from "../types/nota";
import { NotFoundError } from "../utils/error";

export class NotaService {
  constructor(private readonly repository: NotaRepository) {}

  async listar(): Promise<Nota[]> {
    return this.repository.listar();
  }

  async buscarPorId(id: number): Promise<Nota | null> {
    return this.repository.buscarPorId(id);
  }

  async criar(dados: CriarNota): Promise<Nota> {
    return this.repository.criar(dados);
  }

  async alterar(id: number, dados: CriarNota): Promise<Nota | null> {
    const nota = await this.repository.alterar(id, dados);
    if (!nota) throw new NotFoundError("Não há nota com este (ID)!");
    return nota;
  }
}
