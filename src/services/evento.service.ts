import { EventoRepository } from "../repositories/evento.repository";
import { CriarEvento, Evento } from "../types/evento";
import { ValidationError } from "../utils/error";

export class EventoService {
  constructor(private readonly repository: EventoRepository) {}

  async listar(): Promise<Evento[]> {
    return this.repository.listar();
  }

  async criar(dados: CriarEvento): Promise<Evento> {
    if (dados.nome.trim() === "" || dados.nome.length > 100) {
      throw new ValidationError("O nome do evento está fora do padrão");
    }
    if (dados.dataFim < dados.dataInicio) {
      throw new ValidationError(
        "Data final não pode ser anterior a data incial",
      );
    }
    return this.repository.criar(dados);
  }
}
