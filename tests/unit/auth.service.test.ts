import { describe, expect, it, vi } from "vitest";

import { AuthService } from "../../src/auth/auth.service";
import { UnauthorizedError } from "../../src/utils/error";

describe("AuthService.loginAdmin", () => {
  it("deve autenticar um admin com sucesso e gerar token", async () => {
    const usuarioRepository = {
      buscarPorNome: vi.fn().mockResolvedValue({
        id: 7,
        nome: "admin",
        senhaHash: "hash-valido",
      }),
    };
    const juradoRepository = { buscarParaLogin: vi.fn() };

    const passwordService = {
      compare: vi.fn().mockResolvedValue(true),
    };

    const jwtService = {
      generate: vi.fn().mockReturnValue("token-gerado"),
    };

    const service = new AuthService(
      usuarioRepository as any,
      juradoRepository as any,
      passwordService as any,
      jwtService as any,
    );

    const result = await service.loginAdmin({ nome: "admin", senha: "senha123" });

    expect(usuarioRepository.buscarPorNome).toHaveBeenCalledWith("admin");
    expect(passwordService.compare).toHaveBeenCalledWith("senha123", "hash-valido");
    expect(jwtService.generate).toHaveBeenCalledWith({
      sub: 7,
      tipo: "ADMIN",
    });
    expect(result).toEqual({ token: "token-gerado" });
  });

  it("deve rejeitar login quando o usuário não existe", async () => {
    const usuarioRepository = {
      buscarPorNome: vi.fn().mockResolvedValue(null),
    };
    const juradoRepository = { buscarParaLogin: vi.fn() };

    const passwordService = {
      compare: vi.fn(),
    };

    const jwtService = {
      generate: vi.fn(),
    };

    const service = new AuthService(
      usuarioRepository as any,
      juradoRepository as any,
      passwordService as any,
      jwtService as any,
    );

    await expect(service.loginAdmin({ nome: "inexistente", senha: "senha123" })).rejects.toThrow(
      UnauthorizedError,
    );
    await expect(service.loginAdmin({ nome: "inexistente", senha: "senha123" })).rejects.toThrow(
      "Credenciais inválidas.",
    );

    expect(passwordService.compare).not.toHaveBeenCalled();
    expect(jwtService.generate).not.toHaveBeenCalled();
  });

  it("deve rejeitar login quando a senha não bate com o hash", async () => {
    const usuarioRepository = {
      buscarPorNome: vi.fn().mockResolvedValue({
        id: 9,
        nome: "admin",
        senhaHash: "hash-valido",
      }),
    };
    const juradoRepository = { buscarParaLogin: vi.fn() };

    const passwordService = {
      compare: vi.fn().mockResolvedValue(false),
    };

    const jwtService = {
      generate: vi.fn(),
    };

    const service = new AuthService(
      usuarioRepository as any,
      juradoRepository as any,
      passwordService as any,
      jwtService as any,
    );

    await expect(service.loginAdmin({ nome: "admin", senha: "senha-errada" })).rejects.toThrow(
      UnauthorizedError,
    );
    await expect(service.loginAdmin({ nome: "admin", senha: "senha-errada" })).rejects.toThrow(
      "Credenciais inválidas.",
    );

    expect(passwordService.compare).toHaveBeenCalledWith("senha-errada", "hash-valido");
    expect(jwtService.generate).not.toHaveBeenCalled();
  });
});

describe("AuthService.loginJurado", () => {
  it("deve autenticar um jurado com sucesso e gerar token", async () => {
    const usuarioRepository = { buscarPorNome: vi.fn() };
    const juradoRepository = {
      buscarParaLogin: vi.fn().mockResolvedValue({
        id: 42,
        idEvento: 7,
        nome: "Jurado A",
        login: "jurado-a",
        ativo: true,
      }),
    };
    const passwordService = { compare: vi.fn() };
    const jwtService = {
      generate: vi.fn().mockReturnValue("token-jurado"),
    };

    const service = new AuthService(
      usuarioRepository as any,
      juradoRepository as any,
      passwordService as any,
      jwtService as any,
    );

    const result = await service.loginJurado({
      login: "jurado-a",
      senha: "42",
      eventoId: 7,
    });

    expect(juradoRepository.buscarParaLogin).toHaveBeenCalledWith("jurado-a", 7);
    expect(jwtService.generate).toHaveBeenCalledWith({
      sub: 42,
      tipo: "JURADO",
      eventoId: 7,
    });
    expect(result).toEqual({ token: "token-jurado" });
  });

  it("deve rejeitar login de jurado quando a senha não bate com o id", async () => {
    const usuarioRepository = { buscarPorNome: vi.fn() };
    const juradoRepository = {
      buscarParaLogin: vi.fn().mockResolvedValue({
        id: 42,
        idEvento: 7,
        nome: "Jurado A",
        login: "jurado-a",
        ativo: true,
      }),
    };
    const passwordService = { compare: vi.fn() };
    const jwtService = { generate: vi.fn() };

    const service = new AuthService(
      usuarioRepository as any,
      juradoRepository as any,
      passwordService as any,
      jwtService as any,
    );

    await expect(
      service.loginJurado({ login: "jurado-a", senha: "999", eventoId: 7 }),
    ).rejects.toThrow(UnauthorizedError);

    expect(jwtService.generate).not.toHaveBeenCalled();
  });
});
