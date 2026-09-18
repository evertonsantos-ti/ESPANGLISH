import { EventoRepository } from "../repositories/evento.repository";
import { CriarEvento, Evento, AtualizarEvento } from "../types/evento";
import { NotFoundError } from "../utils/error";

export class EventoService {
  constructor(private readonly repository: EventoRepository) {}

  async listar(): Promise<Evento[]> {
    return this.repository.listar();
  }

  async buscarPorId(id: number): Promise<Evento | null> {
    return this.repository.buscarPorId(id);
  }

  async criar(dados: CriarEvento): Promise<Evento> {
    return this.repository.criar(dados);
  }

  async alterar(id: number, dados: AtualizarEvento): Promise<Evento | null> {
    const evento = await this.repository.alterar(id, dados);

    if (!evento) {
      throw new NotFoundError("Não há evento com este (ID)!");
    }

    return evento;
  }

  async inativarEventosVencidos(): Promise<void> {
    return this.repository.inativarEventosVencidos();
  }
}
