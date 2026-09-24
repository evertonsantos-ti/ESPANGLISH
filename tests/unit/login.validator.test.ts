import { describe, expect, it } from "vitest";

import { AdminValidator } from "../../src/utils/validators/login.validator";
import { ValidationError } from "../../src/utils/error";

describe("Validador de login (AdminValidator)", () => {
  it("deve aceitar um login válido", () => {
    const dados = { nome: "admin", senha: "senha123" };

    expect(AdminValidator(dados)).toEqual({ nome: "admin", senha: "senha123" });
  });

  it("deve rejeitar payload que não é um objeto (null)", () => {
    expect(() => AdminValidator(null)).toThrow(ValidationError);
    expect(() => AdminValidator(null)).toThrow("Espera-se um objeto para para login");
  });

  it("deve rejeitar payload que não é um objeto (string)", () => {
    // strings não são objetos e devem ser rejeitadas com a mesma mensagem
    expect(() => AdminValidator("uma string" as unknown)).toThrow(ValidationError);
    expect(() => AdminValidator("uma string" as unknown)).toThrow("Espera-se um objeto para para login");
  });

  it("deve rejeitar quando nome estiver ausente", () => {
    expect(() => AdminValidator({ senha: "senha123" } as unknown)).toThrow(ValidationError);
    expect(() => AdminValidator({ senha: "senha123" } as unknown)).toThrow(
      "Os dados enviando não conrrespondem aos tipos de dados esperados",
    );
  });

  it("deve rejeitar quando senha estiver ausente", () => {
    expect(() => AdminValidator({ nome: "admin" } as unknown)).toThrow(ValidationError);
    expect(() => AdminValidator({ nome: "admin" } as unknown)).toThrow(
      "Os dados enviando não conrrespondem aos tipos de dados esperados",
    );
  });

  it("deve rejeitar quando nome não for string", () => {
    expect(() => AdminValidator({ nome: 123 as unknown as string, senha: "senha" } as unknown)).toThrow(ValidationError);
    expect(() => AdminValidator({ nome: 123 as unknown as string, senha: "senha" } as unknown)).toThrow(
      "Os dados enviando não conrrespondem aos tipos de dados esperados",
    );
  });

  it("deve rejeitar quando senha não for string", () => {
    expect(() => AdminValidator({ nome: "admin", senha: 123 as unknown as string } as unknown)).toThrow(ValidationError);
    expect(() => AdminValidator({ nome: "admin", senha: 123 as unknown as string } as unknown)).toThrow(
      "Os dados enviando não conrrespondem aos tipos de dados esperados",
    );
  });

  it("deve rejeitar nome vazio e senha vazio", () => {
    expect(() => AdminValidator({ nome: "", senha: "senha123" } as unknown)).toThrow(ValidationError);
    expect(() => AdminValidator({ nome: "", senha: "senha123" } as unknown)).toThrow(
      "O campo (nome) ou (senha) não pode ser vazio",
    );

    expect(() => AdminValidator({ nome: "admin", senha: "" } as unknown)).toThrow(ValidationError);
    expect(() => AdminValidator({ nome: "admin", senha: "" } as unknown)).toThrow(
      "O campo (nome) ou (senha) não pode ser vazio",
    );
  });

  it("deve rejeitar nome ou senha que contenham somente espaços em branco", () => {
    expect(() => AdminValidator({ nome: "   ", senha: "senha123" } as unknown)).toThrow(ValidationError);
    expect(() => AdminValidator({ nome: "   ", senha: "senha123" } as unknown)).toThrow(
      "O campo (nome) ou (senha) não pode ser vazio",
    );

    expect(() => AdminValidator({ nome: "admin", senha: "   " } as unknown)).toThrow(ValidationError);
    expect(() => AdminValidator({ nome: "admin", senha: "   " } as unknown)).toThrow(
      "O campo (nome) ou (senha) não pode ser vazio",
    );
  });
});
