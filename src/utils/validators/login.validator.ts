import { AdminLoginInput } from "../../auth/auth.types";
import { ValidationError } from "../error";

export function AdminValidator(adminInput: unknown): AdminLoginInput {
  if (typeof adminInput !== "object" || adminInput === null) {
    throw new ValidationError("Espera-se um objeto para para login");
  }

  const dados = adminInput as Record<string, unknown>;

  if (!(typeof dados.nome === "string") || !(typeof dados.senha === "string")) {
    throw new ValidationError(
      "Os dados enviando não conrrespondem aos tipos de dados esperados",
    );
  }

  const verificadorStringVazia = (data: string): boolean => {
    if (data.trim() === "" || data.length === 0) return true;
    return false;
  };

  if (
    verificadorStringVazia(dados.nome) ||
    verificadorStringVazia(dados.senha)
  ) {
    throw new ValidationError("O campo (nome) ou (senha) não pode ser vazio");
  }

  return {
    nome: dados.nome,
    senha: dados.senha,
  };
}
