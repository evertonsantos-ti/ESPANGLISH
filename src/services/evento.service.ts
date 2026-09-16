import { EventoRepository } from "../repositories/evento.repository";
import { Evento } from "../types/evento";

export class EventoService {
  constructor(private readonly repository: EventoRepository) {}

  async listar(): Promise<Evento[]> {
    return this.repository.listar();
  }
}
