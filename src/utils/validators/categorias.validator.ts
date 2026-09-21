import { CriarCategoria, AtualizarCategoria } from "../../types/categoria";
import { ValidationError } from "../error";

export function validatorCategoria(body: unknown, tipo: "criar"): CriarCategoria;
export function validatorCategoria(
  body: unknown,
  tipo: "atualizar",
): AtualizarCategoria;

export function validatorCategoria(
  body: unknown,
  tipo: "criar" | "atualizar",
): CriarCategoria | AtualizarCategoria {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Dados da categoria inválidos");
  }

  const dados = body as Record<string, unknown>;

  if (typeof dados.idEvento !== "number") {
    throw new ValidationError("(ID) do evento inválido");
  }

  if (typeof dados.nome !== "string") {
    throw new ValidationError("Nome da categoria inválido");
  }

  if (dados.nome.trim() === "" || dados.nome.length > 100) {
    throw new ValidationError("O nome da categoria está fora do padrão!");
  }

  if (typeof dados.ordem !== "number") {
    throw new ValidationError("Ordem da categoria inválida");
  }

  const categoria = {
    idEvento: dados.idEvento as number,
    nome: dados.nome,
    ordem: dados.ordem as number,
  };

  if (tipo === "atualizar") {
    if (typeof dados.ativo !== "boolean") {
      throw new ValidationError("O campo (ATIVO) está com valor diferente do esperado!");
    }
    return {
      ...categoria,
      ativo: dados.ativo as boolean,
    };
  }

  return categoria;
}
