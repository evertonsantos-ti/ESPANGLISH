import { Request, Response } from "express";
import { MovimentacaoPontuacaoService } from "../services/movimentacaoPontuacao.service";
import { validatorMovimentacaoPontuacao } from "../utils/validators/movimentacoesPontuacao.validator";
import { NotFoundError, ValidationError } from "../utils/error";

export class MovimentacaoPontuacaoController {
  constructor(private readonly service: MovimentacaoPontuacaoService) {}

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
    const item = await this.service.criar(validatorMovimentacaoPontuacao(req.body));
    return res.status(201).json(item);
  }
}
