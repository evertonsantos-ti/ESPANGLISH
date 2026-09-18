import { EventoService } from "../services/evento.service";
import { Request, Response } from "express";
import { ValidationError, NotFoundError } from "../utils/error";
import { validatorEvento } from "../utils/validators/eventos.validator";

export class EventoController {
  constructor(private readonly service: EventoService) {}

  async listar(req: Request, res: Response) {
    let eventos;
    if (req.params.id) {
      if (Number.isNaN(Number(req.params.id))) {
        throw new ValidationError("O parâmetro informado deve ser um número!");
      }

      eventos = await this.service.buscarPorId(Number(req.params.id));
    } else {
      eventos = await this.service.listar();
    }

    if (eventos === null) {
      throw new NotFoundError("Nenhum registro encontrado!");
    }

    return res.status(200).json(eventos);
  }

  async criar(req: Request, res: Response) {
    const evento = await this.service.criar(validatorEvento(req.body, "criar"));

    return res.status(201).json(evento);
  }

  async alterar(req: Request, res: Response) {
    // console.log(validatorDict(req.body, "Evento"));
    if (!req.params.id || !req.body) {
      throw new ValidationError(
        "Os requisitos para atualização não foram atendidos!",
      );
    }

    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new ValidationError("O parâmetro informado deve ser um número!");
    }

    const evento = await this.service.alterar(
      id,
      validatorEvento(req.body, "atualizar"),
    );

    return res.status(200).json(evento);
  }
}
