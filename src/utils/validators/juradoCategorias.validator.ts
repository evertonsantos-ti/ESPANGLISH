import { CriarJuradoCategoria } from "../../types/juradoCategoria";
import { ValidationError } from "../error";

export function validatorJuradoCategoria(body: unknown): CriarJuradoCategoria {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Dados da associação jurado-categoria inválidos");
  }

  const dados = body as Record<string, unknown>;

  if (typeof dados.idJurado !== "number") {
    throw new ValidationError("(ID) do jurado inválido");
  }

  if (typeof dados.idCategoria !== "number") {
    throw new ValidationError("(ID) da categoria inválido");
  }

  return {
    idJurado: dados.idJurado as number,
    idCategoria: dados.idCategoria as number,
  };
}
