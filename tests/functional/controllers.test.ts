import { describe, expect, it, vi } from "vitest";

import { AuthController } from "../../src/controllers/auth.controller";
import { AvaliacaoController } from "../../src/controllers/avaliacao.controller";
import { CategoriaController } from "../../src/controllers/categoria.controller";
import { CriterioController } from "../../src/controllers/criterio.controller";
import { EquipeController } from "../../src/controllers/equipe.controller";
import { EventoController } from "../../src/controllers/evento.controller";
import { JuradoController } from "../../src/controllers/jurado.controller";
import { NotaController } from "../../src/controllers/nota.controller";
import * as queryModule from "../../src/database/query";
import { UsuarioRepository } from "../../src/repositories/usuario.repository";
import { NotFoundError, ValidationError } from "../../src/utils/error";

function mockResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any;
}

describe("Controladores em nível funcional", () => {
  it("deve listar evento por id e retornar 200", async () => {
    const service = {
      buscarPorId: vi.fn().mockResolvedValue({ id: 1, nome: "Evento A" }),
      listar: vi.fn(),
    };
    const controller = new EventoController(service as any);
    const req = { params: { id: "1" } } as any;
    const res = mockResponse();

    await controller.listar(req, res);

    expect(service.buscarPorId).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("deve lançar validation ao listar evento com id inválido", async () => {
    const controller = new EventoController({
      buscarPorId: vi.fn(),
      listar: vi.fn(),
    } as any);
    const req = { params: { id: "abc" } } as any;
    const res = mockResponse();

    await expect(controller.listar(req, res)).rejects.toThrow(ValidationError);
  });

  it("deve criar equipe com dados válidos e responder 201", async () => {
    const service = {
      criar: vi
        .fn()
        .mockResolvedValue({ id: 1, idEvento: 1, nome: "Equipe A" }),
    };
    const controller = new EquipeController(service as any);
    const req = { body: { idEvento: 1, nome: "Equipe A" } } as any;
    const res = mockResponse();

    await controller.criar(req, res);

    expect(service.criar).toHaveBeenCalledWith({
      idEvento: 1,
      nome: "Equipe A",
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("deve lançar erro de not found ao atualizar categoria inexistente", async () => {
    const service = {
      alterar: vi
        .fn()
        .mockRejectedValue(
          new NotFoundError("Não há categoria com este (ID)!"),
        ),
    };
    const controller = new CategoriaController(service as any);
    const req = {
      params: { id: "9" },
      body: { idEvento: 1, nome: "Nova", ordem: 2, ativo: true },
    } as any;
    const res = mockResponse();

    await expect(controller.alterar(req, res)).rejects.toThrow(NotFoundError);
  });

  it("deve criar critério com erro ortográfico no payload e rejeitar antes do service", async () => {
    const service = { criar: vi.fn() };
    const controller = new CriterioController(service as any);
    const req = {
      body: { idCategria: 1, nome: "Critério A", ordem: 2 },
    } as any;
    const res = mockResponse();

    await expect(controller.criar(req, res)).rejects.toThrow(ValidationError);
    expect(service.criar).not.toHaveBeenCalled();
  });

  it("deve listar jurado por id e responder 200", async () => {
    const service = {
      buscarPorId: vi
        .fn()
        .mockResolvedValue({
          id: 5,
          idEvento: 2,
          nome: "Jurado X",
          ativo: true,
        }),
      listar: vi.fn(),
    };
    const controller = new JuradoController(service as any);
    const req = { params: { id: "5" } } as any;
    const res = mockResponse();

    await controller.listar(req, res);

    expect(service.buscarPorId).toHaveBeenCalledWith(5);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("deve criar avaliação com dados válidos", async () => {
    const service = {
      criar: vi
        .fn()
        .mockResolvedValue({ id: 7, idEquipe: 1, idCategoria: 2, idJurado: 3 }),
    };
    const controller = new AvaliacaoController(service as any);
    const req = { body: { idEquipe: 1, idCategoria: 2, idJurado: 3 } } as any;
    const res = mockResponse();

    await controller.criar(req, res);

    expect(service.criar).toHaveBeenCalledWith({
      idEquipe: 1,
      idCategoria: 2,
      idJurado: 3,
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("deve alterar nota e rejeitar quando id for texto inválido", async () => {
    const service = { alterar: vi.fn() };
    const controller = new NotaController(service as any);
    const req = {
      params: { id: "texto" },
      body: { idAvaliacao: 1, idCriterio: 2, nota: 90 },
    } as any;
    const res = mockResponse();

    await expect(controller.alterar(req, res)).rejects.toThrow(ValidationError);
    expect(service.alterar).not.toHaveBeenCalled();
  });

  it("deve autenticar admin pelo controller e responder 200", async () => {
    const service = {
      loginAdmin: vi.fn().mockResolvedValue({ token: "token-admin" }),
    };
    const controller = new AuthController(service as any);
    const req = {
      body: { nome: "admin", senha: "senha123" },
    } as any;
    const res = mockResponse();

    await controller.loginAdmin(req, res);

    expect(service.loginAdmin).toHaveBeenCalledWith({
      nome: "admin",
      senha: "senha123",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: "token-admin" });
  });

  it("deve autenticar jurado pelo controller e responder 200", async () => {
    const service = {
      loginJurado: vi.fn().mockResolvedValue({ token: "token-jurado" }),
    };
    const controller = new AuthController(service as any);
    const req = {
      body: { login: "jurado-a", senha: "42", eventoId: 7 },
    } as any;
    const res = mockResponse();

    await controller.loginJurado(req, res);

    expect(service.loginJurado).toHaveBeenCalledWith({
      login: "jurado-a",
      senha: "42",
      eventoId: 7,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: "token-jurado" });
  });

  it("deve rejeitar login admin com payload inválido antes do service", async () => {
    const service = { loginAdmin: vi.fn() };
    const controller = new AuthController(service as any);
    const req = { body: { nome: "admin" } } as any;
    const res = mockResponse();

    await expect(controller.loginAdmin(req, res)).rejects.toThrow(ValidationError);
    expect(service.loginAdmin).not.toHaveBeenCalled();
  });

  it("deve rejeitar login jurado com payload inválido antes do service", async () => {
    const service = { loginJurado: vi.fn() };
    const controller = new AuthController(service as any);
    const req = { body: { login: "jurado-a", senha: "42" } } as any;
    const res = mockResponse();

    await expect(controller.loginJurado(req, res)).rejects.toThrow(ValidationError);
    expect(service.loginJurado).not.toHaveBeenCalled();
  });

  it("deve buscar usuário por nome e retornar o usuário quando encontrado", async () => {
    const querySpy = vi.spyOn(queryModule, "queryOne").mockResolvedValue({
      ID: 7,
      NOME: "admin",
      SENHA_HASH: "hash-seguro",
    });

    const repository = new UsuarioRepository();
    const usuario = await repository.buscarPorNome("admin");

    expect(querySpy).toHaveBeenCalledWith(
      expect.stringContaining("WHERE NOME = ?"),
      ["admin"],
    );
    expect(usuario).toEqual({
      id: 7,
      nome: "admin",
      senhaHash: "hash-seguro",
    });
  });

  it("deve retornar null quando não encontrar usuário por nome", async () => {
    vi.spyOn(queryModule, "queryOne").mockResolvedValueOnce(null);

    const repository = new UsuarioRepository();
    const usuario = await repository.buscarPorNome("inexistente");

    expect(queryModule.queryOne).toHaveBeenCalledWith(
      expect.stringContaining("WHERE NOME = ?"),
      ["inexistente"],
    );
    expect(usuario).toBeNull();
  });
});
