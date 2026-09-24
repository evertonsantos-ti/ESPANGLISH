import { describe, it, expect, vi } from "vitest";
import Jwt from "jsonwebtoken";
import { authenticate } from "../../src/auth/auth.middleware";
import { JwtService } from "../../src/auth/jwt.service";
import { config } from "../../src/config";

describe("Middleware de autenticação", () => {
  it("deve retornar 401 quando o header de autorização não existe", () => {
    const req = { headers: {} } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as any;
    const next = vi.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "Serviço de autenticação não conseguiu encontrar os dados necessários para acesso ao sistema.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 401 quando o header usa um esquema diferente de Bearer", () => {
    const req = { headers: { authorization: "Token abcdef123" } } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as any;
    const next = vi.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "Serviço de autenticação não conseguiu encontrar os dados necessários para acesso ao sistema.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 401 quando o token estiver vazio após o prefixo Bearer", () => {
    const req = { headers: { authorization: "Bearer " } } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as any;
    const next = vi.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Token inválido ou expirado!",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 401 quando o token for inválido ou expirado", () => {
    const expiredToken = Jwt.sign({ sub: 42, tipo: "JURADO", eventoId: 7 }, config.jwt.secret, {
      expiresIn: -1,
    });
    const req = { headers: { authorization: `Bearer ${expiredToken}` } } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as any;
    const next = vi.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Token inválido ou expirado!",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve autenticar usuário ADMIN com sucesso", () => {
    const jwtService = new JwtService();
    const token = jwtService.generate({ sub: 1000, tipo: "ADMIN" });
    const req = { headers: { authorization: `Bearer ${token}` } } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as any;
    const next = vi.fn();

    authenticate(req, res, next);

    expect(req.user).toEqual({ id: 1000, tipo: "ADMIN" });
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("deve autenticar usuário JURADO com sucesso e preservar eventoId", () => {
    const jwtService = new JwtService();
    const token = jwtService.generate({ sub: 2000, tipo: "JURADO", eventoId: 7 });
    const req = { headers: { authorization: `Bearer ${token}` } } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as any;
    const next = vi.fn();

    authenticate(req, res, next);

    expect(req.user).toEqual({ id: 2000, tipo: "JURADO", eventoId: 7 });
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
