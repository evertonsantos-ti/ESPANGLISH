import { Request, Response } from "express";
import { JuradoService } from "../services/jurado.service";
import { validatorJurado } from "../utils/validators/jurados.validator";
import { NotFoundError, ValidationError } from "../utils/error";

export class JuradoController {
  constructor(private readonly service: JuradoService) {}

  async listar(req: Request, res: Response) {
    let jurados;
    if (req.params.id) {
      if (Number.isNaN(Number(req.params.id))) {
        throw new ValidationError("O parâmetro informado deve ser um número");
      }
      jurados = await this.service.buscarPorId(Number(req.params.id));
    } else {
      jurados = await this.service.listar();
    }

    if (jurados === null) {
      throw new NotFoundError("Nenhum registro encontrado!");
    }

    return res.status(200).json(jurados);
  }

  async criar(req: Request, res: Response) {
    const jurado = await this.service.criar(validatorJurado(req.body, "criar"));
    return res.status(201).json(jurado);
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

    const jurado = await this.service.alterar(
      id,
      validatorJurado(req.body, "atualizar"),
    );
    return res.status(200).json(jurado);
  }
}
