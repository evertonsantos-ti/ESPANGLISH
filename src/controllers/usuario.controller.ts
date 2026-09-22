import { Request, Response } from "express";
import { UsuarioService } from "../services/usuario.service";
import { validatorUsuario } from "../utils/validators/usuarios.validator";
import { NotFoundError, ValidationError } from "../utils/error";

export class UsuarioController {
  constructor(private readonly service: UsuarioService) {}

  async listar(req: Request, res: Response) {
    let usuarios;
    if (req.params.id) {
      if (Number.isNaN(Number(req.params.id))) {
        throw new ValidationError("O parâmetro informado deve ser um número");
      }
      usuarios = await this.service.buscarPorId(Number(req.params.id));
    } else {
      usuarios = await this.service.listar();
    }

    if (usuarios === null) {
      throw new NotFoundError("Nenhum registro encontrado!");
    }

    return res.status(200).json(usuarios);
  }

  async criar(req: Request, res: Response) {
    const usuario = await this.service.criar(validatorUsuario(req.body, "criar"));
    return res.status(201).json(usuario);
  }

  async alterar(req: Request, res: Response) {
    if (!req.params.id || !req.body) {
      throw new ValidationError("Os requisitos para atualização não foram atendidos!");
    }

    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new ValidationError("O parâmetro informado deve ser um número");
    }

    const usuario = await this.service.alterar(id, validatorUsuario(req.body, "atualizar"));
    return res.status(200).json(usuario);
  }

  async deletar(req: Request, res: Response) {
    if (!req.params.id) {
      throw new ValidationError("ID do usuário é obrigatório");
    }
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new ValidationError("O parâmetro informado deve ser um número");
    }

    await this.service.deletar(id);
    return res.status(204).send();
  }
}
