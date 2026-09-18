import { EventoService } from "../services/evento.service";
import { Request, Response } from "express";
import { ValidationError } from "../utils/error";

export class EventoController {
  constructor(private readonly service: EventoService) {}

  async listar(req: Request, res: Response) {
    if (req.params.id) {
      const eventos = await this.service.buscarPorId(Number(req.params.id));
      console.log(eventos);
      return res.json(eventos);
    }
    const eventos = await this.service.listar();
    return res.json(eventos);
  }

  async criar(req: Request, res: Response) {
    const dataInicio = new Date(req.body.dataInicio);
    const dataFim = new Date(req.body.dataFim);

    if (typeof req.body.nome !== "string") {
      throw new ValidationError("Nome do evento inválido");
    }

    if (isNaN(dataInicio.getTime())) {
      throw new ValidationError("Data inicial inválida");
    }

    if (isNaN(dataFim.getTime())) {
      throw new ValidationError("Data final inválida");
    }

    const evento = await this.service.criar({
      nome: req.body.nome,
      dataInicio,
      dataFim,
    });

    return res.status(201).json(evento);
  }
}
