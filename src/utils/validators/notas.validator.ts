import { CriarNota } from "../../types/nota";
import { ValidationError } from "../error";

export function validatorNota(body: unknown): CriarNota {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Dados da nota inválidos");
  }

  const dados = body as Record<string, unknown>;

  if (
    typeof dados.idAvaliacao !== "number" ||
    !Number.isInteger(dados.idAvaliacao) ||
    dados.idAvaliacao <= 0
  ) {
    throw new ValidationError("(ID) da avaliação inválido");
  }

  if (
    typeof dados.idCriterio !== "number" ||
    !Number.isInteger(dados.idCriterio) ||
    dados.idCriterio <= 0
  ) {
    throw new ValidationError("(ID) do critério inválido");
  }

  if (typeof dados.nota !== "number" || !Number.isFinite(dados.nota)) {
    throw new ValidationError("Valor da nota inválido");
  }

  if (dados.nota < 0 || dados.nota > 100) {
    throw new ValidationError(
      "Valor da nota fora do intervalo permitido (0-100)",
    );
  }

  if (dados.nota % 5 !== 0) {
    throw new ValidationError("A nota deve ser um múltiplo de 5");
  }

  return {
    idAvaliacao: dados.idAvaliacao as number,
    idCriterio: dados.idCriterio as number,
    nota: dados.nota as number,
  };
}
