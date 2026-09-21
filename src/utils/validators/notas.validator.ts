import { CriarNota } from "../../types/nota";
import { ValidationError } from "../error";

export function validatorNota(body: unknown): CriarNota {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Dados da nota inválidos");
  }

  const dados = body as Record<string, unknown>;

  if (typeof dados.idAvaliacao !== "number") {
    throw new ValidationError("(ID) da avaliação inválido");
  }

  if (typeof dados.idCriterio !== "number") {
    throw new ValidationError("(ID) do critério inválido");
  }

  if (typeof dados.nota !== "number") {
    throw new ValidationError("Valor da nota inválido");
  }

  if (dados.nota < 0 || dados.nota > 100) {
    throw new ValidationError("Valor da nota fora do intervalo permitido (0-100)");
  }

  return {
    idAvaliacao: dados.idAvaliacao as number,
    idCriterio: dados.idCriterio as number,
    nota: dados.nota as number,
  };
}
