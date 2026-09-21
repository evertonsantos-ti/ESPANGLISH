import { Request, Response } from "express";
import { CategoriaService } from "../services/categoria.service";
import { validatorCategoria } from "../utils/validators/categorias.validator";
import { NotFoundError, ValidationError } from "../utils/error";

export class CategoriaController {
  constructor(private readonly service: CategoriaService) {}

  async listar(req: Request, res: Response) {
    let categorias;
    if (req.params.id) {
      if (Number.isNaN(Number(req.params.id))) {
        throw new ValidationError("O parâmetro informado deve ser um número");
      }
      categorias = await this.service.buscarPorId(Number(req.params.id));
    } else {
      categorias = await this.service.listar();
    }

    if (categorias === null) {
      throw new NotFoundError("Nenhum registro encontrado!");
    }

    return res.status(200).json(categorias);
  }

  async criar(req: Request, res: Response) {
    const categoria = await this.service.criar(
      validatorCategoria(req.body, "criar"),
    );
    return res.status(201).json(categoria);
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

    const categoria = await this.service.alterar(
      id,
      validatorCategoria(req.body, "atualizar"),
    );
    return res.status(200).json(categoria);
  }
}
