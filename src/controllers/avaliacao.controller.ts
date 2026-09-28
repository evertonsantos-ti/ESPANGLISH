import { Request, Response } from "express";
import { AvaliacaoService } from "../services/avaliacao.service";
import { validatorAvaliacao } from "../utils/validators/avaliacoes.validator";
import { NotFoundError, ValidationError } from "../utils/error";

export class AvaliacaoController {
  constructor(private readonly service: AvaliacaoService) {}

  async listar(req: Request, res: Response) {
    let itens;
    if (req.params.id) {
      if (Number.isNaN(Number(req.params.id))) {
        throw new ValidationError("O parâmetro informado deve ser um número");
      }
      itens = await this.service.buscarPorId(Number(req.params.id));
    } else if (req.user?.tipo === "JURADO") {
      itens = await this.service.buscarPorJurado(
        req.user.id,
        req.user.eventoId,
      );
    } else {
      itens = await this.service.listar();
    }

    if (itens === null) {
      throw new NotFoundError("Nenhum registro encontrado!");
    }

    return res.status(200).json(itens);
  }

  async criar(req: Request, res: Response) {
    const item = await this.service.criar(validatorAvaliacao(req.body));
    return res.status(201).json(item);
  }
}
