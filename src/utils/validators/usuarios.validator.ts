import { CriarUsuario, AtualizarUsuario } from "../../types/usuario";
import { ValidationError } from "../error";

export function validatorUsuario(body: unknown, tipo: "criar"): CriarUsuario;
export function validatorUsuario(body: unknown, tipo: "atualizar"): AtualizarUsuario;

export function validatorUsuario(body: unknown, tipo: "criar" | "atualizar") {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Dados do usuário inválidos");
  }

  const dados = body as Record<string, unknown>;

  if (typeof dados.nome !== "string") {
    throw new ValidationError("Nome do usuário inválido");
  }
  if (dados.nome.trim() === "" || dados.nome.length > 100) {
    throw new ValidationError("O nome do usuário está fora do padrão!");
  }

  if (typeof dados.senhaHash !== "string") {
    throw new ValidationError("Senha inválida");
  }
  if (dados.senhaHash.trim() === "" || dados.senhaHash.length > 200) {
    throw new ValidationError("A senha está fora do padrão!");
  }

  const usuario = {
    nome: dados.nome as string,
    senhaHash: dados.senhaHash as string,
  };

  return usuario;
}
