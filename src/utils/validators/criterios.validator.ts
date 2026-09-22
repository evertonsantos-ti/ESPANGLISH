import { CriarCriterio, AtualizarCriterio } from "../../types/criterio";
import { ValidationError } from "../error";

export function validatorCriterio(body: unknown, tipo: "criar"): CriarCriterio;
export function validatorCriterio(
  body: unknown,
  tipo: "atualizar",
): AtualizarCriterio;

export function validatorCriterio(
  body: unknown,
  tipo: "criar" | "atualizar",
): CriarCriterio | AtualizarCriterio {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Dados do critério inválidos");
  }

  const dados = body as Record<string, unknown>;

  if (typeof dados.idCategoria !== "number") {
    throw new ValidationError("(ID) da categoria inválido");
  }

  if (typeof dados.nome !== "string") {
    throw new ValidationError("Nome do critério inválido");
  }

  if (dados.nome.trim() === "" || dados.nome.length > 100) {
    throw new ValidationError("O nome do critério está fora do padrão!");
  }

  if (typeof dados.ordem !== "number") {
    throw new ValidationError("Ordem do critério inválida");
  }

  const criterio = {
    idCategoria: dados.idCategoria as number,
    nome: dados.nome,
    ordem: dados.ordem as number,
  };

  if (tipo === "atualizar") {
    if (typeof dados.ativo !== "boolean") {
      throw new ValidationError(
        "O campo (ATIVO) está com valor diferente do esperado!",
      );
    }
    return {
      ...criterio,
      ativo: dados.ativo as boolean,
    };
  }

  return criterio;
}
