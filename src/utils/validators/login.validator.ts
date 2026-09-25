import { AdminLoginInput, JuradoLoginInput } from "../../auth/auth.types";
import { ValidationError } from "../error";

export function AdminValidator(adminInput: unknown): AdminLoginInput {
  if (typeof adminInput !== "object" || adminInput === null) {
    throw new ValidationError("Espera-se um objeto para login");
  }

  const dados = adminInput as Record<string, unknown>;

  if (!(typeof dados.nome === "string") || !(typeof dados.senha === "string")) {
    throw new ValidationError(
      "Os dados enviados não correspondem aos tipos esperados",
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
export function JuradoValidator(juradoInput: unknown): JuradoLoginInput {
  if (typeof juradoInput !== "object" || juradoInput === null) {
    throw new ValidationError("Espera-se um objeto para login");
  }

  const dados = juradoInput as Record<string, unknown>;

  if (
    !(typeof dados.login === "string") ||
    !(typeof dados.senha === "string") ||
    !(typeof dados.eventoId === "number")
  ) {
    throw new ValidationError(
      "Os dados enviados não correspondem aos tipos esperados",
    );
  }

  const verificadorStringVazia = (data: string): boolean => {
    if (data.trim() === "" || data.length === 0) return true;
    return false;
  };

  if (
    verificadorStringVazia(dados.login) ||
    verificadorStringVazia(dados.senha) ||
    Number(dados.eventoId) <= 0
  ) {
    throw new ValidationError(
      "Os campos (login), (senha) e (eventoId) não podem estar vazios ou inválidos",
    );
  }

  return {
    login: dados.login,
    senha: dados.senha,
    eventoId: dados.eventoId,
  };
}
