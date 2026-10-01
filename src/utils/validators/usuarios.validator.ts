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

  const senha = dados.senha;
  if (tipo === "criar" && typeof senha !== "string") {
    throw new ValidationError("Senha inválida");
  }
  if (senha !== undefined && typeof senha !== "string") {
    throw new ValidationError("Senha inválida");
  }
  if (typeof senha === "string" && (senha.length < 6 || senha.length > 100)) {
    throw new ValidationError("A senha deve ter entre 6 e 100 caracteres.");
  }

  return {
    nome: dados.nome as string,
    ...(typeof senha === "string" ? { senha } : {}),
  };
}
