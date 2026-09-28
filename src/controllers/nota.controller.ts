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
      itens =
        req.user?.tipo === "JURADO"
          ? await this.service.buscarPorIdJurado(
              Number(req.params.id),
              req.user.id,
              req.user.eventoId,
            )
          : await this.service.buscarPorId(Number(req.params.id));
    } else if (req.user?.tipo === "JURADO") {
      itens = await this.service.listarPorJurado(
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
    const dados = validatorNota(req.body);
    const item =
      req.user?.tipo === "JURADO"
        ? await this.service.criarParaJurado(
            dados,
            req.user.id,
            req.user.eventoId,
          )
        : await this.service.criar(dados);
    return res.status(201).json(item);
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

    const dados = validatorNota(req.body);
    const nota =
      req.user?.tipo === "JURADO"
        ? await this.service.alterarParaJurado(
            id,
            dados,
            req.user.id,
            req.user.eventoId,
          )
        : await this.service.alterar(id, dados);
    return res.status(200).json(nota);
  }
}
