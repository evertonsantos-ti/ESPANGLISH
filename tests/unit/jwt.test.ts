import { describe, it, expect } from "vitest";
import { JwtService } from "../../src/auth/jwt.service";
import Jwt from "jsonwebtoken";
import { config } from "../../src/config";

describe("Serviço JWT", () => {
  it("deve retornar o token de autenticação", () => {
    const jwtService = new JwtService();

    const token = jwtService.generate({
      sub: 1000,
      tipo: "JURADO",
      eventoId: 3,
    });

    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });
});

describe("Verificação JWT", () => {
  it("Deve validar o token de ADMIN", () => {
    const jwtService = new JwtService();

    const token = jwtService.generate({
      sub: 1000,
      tipo: "ADMIN",
    });

    expect(jwtService.verify(token)).toEqual({
      sub: 1000,
      tipo: "ADMIN",
    });
  });
});

describe("Verificação JWT", () => {
  it("Deve validar o token de JURADO", () => {
    const jwtService = new JwtService();

    const token = jwtService.generate({
      sub: 1000,
      tipo: "JURADO",
      eventoId: 3,
    });

    expect(jwtService.verify(token)).toEqual({
      sub: 1000,
      tipo: "JURADO",
      eventoId: 3,
    });
  });
});

describe("Verificação de error de adulteração de Token", () => {
  it("Deve capturar error de token adulterado!", () => {
    const jwtService = new JwtService();

    const token = jwtService.generate({
      sub: 1000,
      tipo: "JURADO",
      eventoId: 3,
    });

    const tokenAdulterado = token.slice(0, -1) + "E";
    expect(jwtService.verify(tokenAdulterado)).toBe(null);
  });
});

describe("Verificação de token vazio", () => {
  it("Deve retornar null para token vazio!", () => {
    const jwtService = new JwtService();
    const tokenVazio = "";

    expect(jwtService.verify(tokenVazio)).toBe(null);
  });
});

describe("Verificação de token expirado", () => {
  it("Deve retornar null para token expirado!", () => {
    const jwtService = new JwtService();
    const tokenExpirado = Jwt.sign(
      { nome: "Token expirado" },
      config.jwt.secret,
      { expiresIn: -1 },
    );

    expect(jwtService.verify(tokenExpirado)).toBe(null);
  });
});

describe("Verificação de token inválido", () => {
  it("Deve capturar error de token inválido!", () => {
    const jwtService = new JwtService();
    const tokenInvalido = Jwt.sign(
      { nome: "Token expirado" },
      config.jwt.secret,
      { expiresIn: config.jwt.expires },
    );

    expect(jwtService.verify(tokenInvalido)).toBe(null);
  });
});
