import { CriarAvaliacao } from "../../types/avaliacao";
import { ValidationError } from "../error";

export function validatorAvaliacao(body: unknown): CriarAvaliacao {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Dados da avaliação inválidos");
  }

  const dados = body as Record<string, unknown>;

  if (typeof dados.idEquipe !== "number") {
    throw new ValidationError("(ID) da equipe inválido");
  }

  if (typeof dados.idCategoria !== "number") {
    throw new ValidationError("(ID) da categoria inválido");
  }

  if (typeof dados.idJurado !== "number") {
    throw new ValidationError("(ID) do jurado inválido");
  }

  return {
    idEquipe: dados.idEquipe as number,
    idCategoria: dados.idCategoria as number,
    idJurado: dados.idJurado as number,
  };
}
