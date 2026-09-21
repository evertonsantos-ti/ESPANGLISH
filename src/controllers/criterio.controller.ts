import { Request, Response } from "express";
import { CriterioService } from "../services/criterio.service";
import { validatorCriterio } from "../utils/validators/criterios.validator";
import { NotFoundError, ValidationError } from "../utils/error";

export class CriterioController {
  constructor(private readonly service: CriterioService) {}

  async listar(req: Request, res: Response) {
    let criterios;
    if (req.params.id) {
      if (Number.isNaN(Number(req.params.id))) {
        throw new ValidationError("O parâmetro informado deve ser um número");
      }
      criterios = await this.service.buscarPorId(Number(req.params.id));
    } else {
      criterios = await this.service.listar();
    }

    if (criterios === null) {
      throw new NotFoundError("Nenhum registro encontrado!");
    }

    return res.status(200).json(criterios);
  }

  async criar(req: Request, res: Response) {
    const criterio = await this.service.criar(validatorCriterio(req.body, "criar"));
    return res.status(201).json(criterio);
  }

  async alterar(req: Request, res: Response) {
    if (!req.params.id || !req.body) {
      throw new ValidationError("Os requisitos para atualização não foram atendidos!");
    }

    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new ValidationError("O parâmetro informado deve ser um número");
    }

    const criterio = await this.service.alterar(id, validatorCriterio(req.body, "atualizar"));
    return res.status(200).json(criterio);
  }
}
