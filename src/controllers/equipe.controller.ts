import { EquipeService } from "../services/equipe.service";
import { Request, Response } from "express";
import { NotFoundError, ValidationError } from "../utils/error";
import { CriarEquipe } from "../types/equipe";
import { validatorEquipe } from "../utils/validators/equipes.validator";

export class EquipeController {
  constructor(private readonly service: EquipeService) {}

  async listar(req: Request, res: Response) {
    let equipes;
    if (req.params.id) {
      if (Number.isNaN(Number(req.params.id))) {
        throw new ValidationError("O parâmetro informado deve ser um número");
      }
      equipes = await this.service.buscarPorId(Number(req.params.id));
    } else {
      equipes = await this.service.listar();
    }

    if (equipes === null) {
      throw new NotFoundError("Nenhum registro encontrado!");
    }

    return res.status(200).json(equipes);
  }

  async criar(req: Request, res: Response) {
    const equipe = await this.service.criar(validatorEquipe(req.body));
    return res.status(201).json(equipe);
  }

  async alterar(req: Request, res: Response) {
    if (!req.params.id || !req.body) {
      throw new ValidationError(
        "Os requisitos para atualização não foram atendidos!",
      );
    }

    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new ValidationError("O parâmetro informado deve ser um número");
    }

    const equipe = await this.service.alterar(id, validatorEquipe(req.body));

    return res.status(200).json(equipe);
  }
}
