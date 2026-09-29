import type { Request, Response } from "express";
import { RelatorioService } from "../services/relatorio.service";
import { ValidationError } from "../utils/error";

export class RelatorioController {
  constructor(private readonly service: RelatorioService) {}

  async listarPorEvento(req: Request, res: Response) {
    const eventoId = Number(req.params.eventoId);
    if (!Number.isInteger(eventoId) || eventoId <= 0) {
      throw new ValidationError("O parâmetro informado deve ser um número positivo");
    }

    return res.status(200).json(await this.service.gerarPorEvento(eventoId));
  }
}
