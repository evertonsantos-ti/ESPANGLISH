import { CriarJurado, AtualizarJurado } from "../../types/jurado";
import { ValidationError } from "../error";

export function validatorJurado(body: unknown, tipo: "criar"): CriarJurado;
export function validatorJurado(body: unknown, tipo: "atualizar"): AtualizarJurado;

export function validatorJurado(
  body: unknown,
  tipo: "criar" | "atualizar",
): CriarJurado | AtualizarJurado {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Dados do jurado inválidos");
  }

  const dados = body as Record<string, unknown>;

  if (typeof dados.idEvento !== "number") {
    throw new ValidationError("(ID) do evento inválido");
  }

  if (typeof dados.nome !== "string") {
    throw new ValidationError("Nome do jurado inválido");
  }

  if (dados.nome.trim() === "" || dados.nome.length > 100) {
    throw new ValidationError("O nome do jurado está fora do padrão!");
  }

  const jurado = {
    idEvento: dados.idEvento as number,
    nome: dados.nome,
  };

  if (tipo === "atualizar") {
    if (typeof dados.ativo !== "boolean") {
      throw new ValidationError("O campo (ATIVO) está com valor diferente do esperado!");
    }
    return {
      ...jurado,
      ativo: dados.ativo as boolean,
    };
  }

  return jurado;
}
