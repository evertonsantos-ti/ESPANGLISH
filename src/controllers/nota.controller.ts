import { Request, Response } from "express";
import { NotaService } from "../services/nota.service";
import { validatorNota } from "../utils/validators/notas.validator";
import { NotFoundError, ValidationError } from "../utils/error";

export class NotaController {
  constructor(private readonly service: NotaService) {}

  async listar(req: Request, res: Response) {
    let itens;
    if (req.params.id) {
      if (Number.isNaN(Number(req.params.id))) {
        throw new ValidationError("O parâmetro informado deve ser um número");
      }
      itens = await this.service.buscarPorId(Number(req.params.id));
    } else {
      itens = await this.service.listar();
    }

    if (itens === null) {
      throw new NotFoundError("Nenhum registro encontrado!");
    }

    return res.status(200).json(itens);
  }

  async criar(req: Request, res: Response) {
    const item = await this.service.criar(validatorNota(req.body));
    return res.status(201).json(item);
  }

  async alterar(req: Request, res: Response) {
    if (!req.params.id || !req.body) {
      throw new ValidationError("Os requisitos para atualização não foram atendidos!");
    }

    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new ValidationError("O parâmetro informado deve ser um número");
    }

    const nota = await this.service.alterar(id, validatorNota(req.body));
    return res.status(200).json(nota);
  }
}
