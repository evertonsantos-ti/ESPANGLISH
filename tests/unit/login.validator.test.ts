import { describe, expect, it } from "vitest";

import { ValidationError } from "../../src/utils/error";
import { AdminValidator, JuradoValidator } from "../../src/utils/validators/login.validator";

describe("Validador de login (AdminValidator)", () => {
  it("deve aceitar um login válido", () => {
    const dados = { nome: "admin", senha: "senha123" };

    expect(AdminValidator(dados)).toEqual({ nome: "admin", senha: "senha123" });
  });

  it("deve rejeitar payload que não é um objeto (null)", () => {
    expect(() => AdminValidator(null)).toThrow(ValidationError);
    expect(() => AdminValidator(null)).toThrow("Espera-se um objeto para login");
  });

  it("deve rejeitar payload que não é um objeto (string)", () => {
    expect(() => AdminValidator("uma string" as unknown)).toThrow(ValidationError);
    expect(() => AdminValidator("uma string" as unknown)).toThrow("Espera-se um objeto para login");
  });

  it("deve rejeitar quando nome estiver ausente", () => {
    expect(() => AdminValidator({ senha: "senha123" } as unknown)).toThrow(ValidationError);
    expect(() => AdminValidator({ senha: "senha123" } as unknown)).toThrow(
      "Os dados enviados não correspondem aos tipos esperados",
    );
  });

  it("deve rejeitar quando senha estiver ausente", () => {
    expect(() => AdminValidator({ nome: "admin" } as unknown)).toThrow(ValidationError);
    expect(() => AdminValidator({ nome: "admin" } as unknown)).toThrow(
      "Os dados enviados não correspondem aos tipos esperados",
    );
  });

  it("deve rejeitar quando nome não for string", () => {
    expect(() => AdminValidator({ nome: 123 as unknown as string, senha: "senha" } as unknown)).toThrow(ValidationError);
    expect(() => AdminValidator({ nome: 123 as unknown as string, senha: "senha" } as unknown)).toThrow(
      "Os dados enviados não correspondem aos tipos esperados",
    );
  });

  it("deve rejeitar quando senha não for string", () => {
    expect(() => AdminValidator({ nome: "admin", senha: 123 as unknown as string } as unknown)).toThrow(ValidationError);
    expect(() => AdminValidator({ nome: "admin", senha: 123 as unknown as string } as unknown)).toThrow(
      "Os dados enviados não correspondem aos tipos esperados",
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

describe("Validador de login (JuradoValidator)", () => {
  it("deve aceitar um login de jurado válido", () => {
    const dados = { login: "jurado-a", senha: "42", eventoId: 7 };

    expect(JuradoValidator(dados)).toEqual({
      login: "jurado-a",
      senha: "42",
      eventoId: 7,
    });
  });

  it("deve rejeitar payload que não é um objeto (null)", () => {
    expect(() => JuradoValidator(null)).toThrow(ValidationError);
    expect(() => JuradoValidator(null)).toThrow("Espera-se um objeto para login");
  });

  it("deve rejeitar quando login, senha ou eventoId estiverem ausentes", () => {
    expect(() => JuradoValidator({ login: "jurado-a", senha: "42" } as unknown)).toThrow(
      "Os dados enviados não correspondem aos tipos esperados",
    );
    expect(() => JuradoValidator({ login: "jurado-a", eventoId: 7 } as unknown)).toThrow(
      "Os dados enviados não correspondem aos tipos esperados",
    );
  });

  it("deve rejeitar quando os campos não forem do tipo esperado", () => {
    expect(() =>
      JuradoValidator({
        login: 123,
        senha: "42",
        eventoId: 7,
      } as any),
    ).toThrow("Os dados enviados não correspondem aos tipos esperados");

    expect(() =>
      JuradoValidator({
        login: "jurado-a",
        senha: 42,
        eventoId: 7,
      } as any),
    ).toThrow("Os dados enviados não correspondem aos tipos esperados");

    expect(() =>
      JuradoValidator({
        login: "jurado-a",
        senha: "42",
        eventoId: "7",
      } as any),
    ).toThrow("Os dados enviados não correspondem aos tipos esperados");
  });

  it("deve rejeitar login, senha ou eventoId vazios ou inválidos", () => {
    expect(() => JuradoValidator({ login: "", senha: "42", eventoId: 7 } as unknown)).toThrow(
      "Os campos (login), (senha) e (eventoId) não podem estar vazios ou inválidos",
    );
    expect(() => JuradoValidator({ login: "jurado-a", senha: "   ", eventoId: 7 } as unknown)).toThrow(
      "Os campos (login), (senha) e (eventoId) não podem estar vazios ou inválidos",
    );
    expect(() => JuradoValidator({ login: "jurado-a", senha: "42", eventoId: 0 } as unknown)).toThrow(
      "Os campos (login), (senha) e (eventoId) não podem estar vazios ou inválidos",
    );
  });
});
