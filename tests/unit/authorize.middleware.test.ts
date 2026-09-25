import { describe, it, expect, vi } from "vitest";

import { authorize } from "../../src/auth/authorize.middleware";

function mockResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any;
}

describe("authorize middleware", () => {
  it("deve retornar 401 quando não houver usuário na requisição", () => {
    const req = {} as any;
    const res = mockResponse();
    const next = vi.fn();

    const middleware = authorize("ADMIN");
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Usuário não autenticado.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 403 quando o usuário não tiver o tipo permitido", () => {
    const req = { user: { id: 1, tipo: "JURADO" } } as any;
    const res = mockResponse();
    const next = vi.fn();

    const middleware = authorize("ADMIN");
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Usuário não possui permissão para acessar este recurso.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve chamar next quando o usuário tiver tipo permitido", () => {
    const req = { user: { id: 1, tipo: "ADMIN" } } as any;
    const res = mockResponse();
    const next = vi.fn();

    const middleware = authorize("ADMIN");
    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("deve chamar next quando o usuário for JURADO", () => {
    const req = {
      user: {
        id: 2,
        tipo: "JURADO",
      },
    } as any;

    const res = mockResponse();
    const next = vi.fn();

    const middleware = authorize("JURADO");

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("deve aceitar múltiplos tipos permitidos", () => {
    const req = { user: { id: 2, tipo: "JURADO" } } as any;
    const res = mockResponse();
    const next = vi.fn();

    const middleware = authorize("ADMIN", "JURADO");
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
