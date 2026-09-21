import { CriarEquipe } from "../../types/equipe";
import { ValidationError } from "../error";

export function validatorEquipe(body: unknown): CriarEquipe {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Dados da equipe inválidos!");
  }
  const dados = body as Record<string, unknown>;

  // Validar ID EVENTO
  if (typeof dados.idEvento !== "number") {
    throw new ValidationError("(ID) do evento inválido");
  }

  // Validar NOME
  if (typeof dados.nome !== "string") {
    throw new ValidationError("Nome da equipe inválido");
  }
  if (dados.nome.trim() === "" || dados.nome.length > 100) {
    throw new ValidationError("O nome da equipe está fora do padrão!");
  }

  return {
    idEvento: dados.idEvento,
    nome: dados.nome,
  };
}
