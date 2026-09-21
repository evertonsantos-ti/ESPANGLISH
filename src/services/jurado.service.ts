import { JuradoRepository } from "../repositories/jurado.repository";
import { Jurado, CriarJurado, AtualizarJurado } from "../types/jurado";
import { NotFoundError } from "../utils/error";

export class JuradoService {
  constructor(private readonly repository: JuradoRepository) {}

  async listar(): Promise<Jurado[]> {
    return this.repository.listar();
  }

  async buscarPorId(id: number): Promise<Jurado | null> {
    return this.repository.buscarPorId(id);
  }

  async criar(dados: CriarJurado): Promise<Jurado> {
    return this.repository.criar(dados);
  }

  async alterar(id: number, dados: AtualizarJurado): Promise<Jurado | null> {
    const jurado = await this.repository.alterar(id, dados);
    if (!jurado) throw new NotFoundError("Não há jurado com este (ID)!");
    return jurado;
  }
}
