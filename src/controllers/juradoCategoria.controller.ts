import { Request, Response } from "express";
import { JuradoCategoriaService } from "../services/juradoCategoria.service";
import { validatorJuradoCategoria } from "../utils/validators/juradoCategorias.validator";
import { NotFoundError, ValidationError } from "../utils/error";

export class JuradoCategoriaController {
  constructor(private readonly service: JuradoCategoriaService) {}

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
    const item = await this.service.criar(validatorJuradoCategoria(req.body));
    return res.status(201).json(item);
  }

  async deletar(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError("O parâmetro informado deve ser um número positivo");
    }
    await this.service.deletar(id);
    return res.status(204).send();
  }
}
