import { EventoService } from "../services/evento.service";
import { Request, Response } from "express";
import * as logger from "../utils/logger";

export class EventoController {
  constructor(private readonly service: EventoService) {}

  async listar(req: Request, res: Response) {
    try {
      const eventos = await this.service.listar();
      return res.json(eventos);
    } catch (error) {
      res.status(500).json({ error: "Error ao listar eventos" });
      logger.error(`${error}`);
    }
  }
}
