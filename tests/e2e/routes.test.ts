import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";

import app from "../../src/app";
import { CategoriaRepository } from "../../src/repositories/categoria.repository";
import { EventoRepository } from "../../src/repositories/evento.repository";
import { MovimentacaoPontuacaoRepository } from "../../src/repositories/movimentacaoPontuacao.repository";
import { UsuarioRepository } from "../../src/repositories/usuario.repository";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("E2E das rotas da API", () => {
  it("deve listar eventos pela rota /api/eventos", async () => {
    vi.spyOn(EventoRepository.prototype, "listar").mockResolvedValue([
      {
        id: 1,
        nome: "Evento A",
        competencia: 2025,
        dataInicio: new Date("2025-01-01"),
        dataFim: new Date("2025-01-10"),
        ativo: true,
      },
    ]);

    const res = await request(app).get("/api/eventos");

    expect(res.status).toBe(200);
    expect(res.body[0].nome).toBe("Evento A");
  });

  it("deve criar categoria pela rota /api/categorias", async () => {
    vi.spyOn(CategoriaRepository.prototype, "criar").mockResolvedValue({
      id: 1,
      idEvento: 1,
      nome: "Categoria A",
      ordem: 1,
      ativo: true,
    });

    const res = await request(app).post("/api/categorias").send({
      idEvento: 1,
      nome: "Categoria A",
      ordem: 1,
    });

    expect(res.status).toBe(201);
    expect(res.body.nome).toBe("Categoria A");
  });

  it("deve rejeitar payload com typo em equipe e responder 400", async () => {
    const res = await request(app).post("/api/equipes").send({
      idEvent: 1,
      nomee: "Equipe A",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("(ID) do evento inválido");
  });

  it("deve rejeitar tipo com ortografia inválida em movimentação", async () => {
    const res = await request(app).post("/api/movimentacoes-pontuacao").send({
      idEvento: 1,
      idEquipe: 1,
      tipo: "BONU S",
      descricao: "Pontuação inválida",
      pontos: 10,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Tipo desconhecido");
  });

  it("deve criar movimentação quando o payload é válido", async () => {
    vi.spyOn(
      MovimentacaoPontuacaoRepository.prototype,
      "criar",
    ).mockResolvedValue({
      id: 1,
      idEvento: 1,
      idEquipe: 1,
      tipo: "PONTUACAO",
      descricao: "Pontuação por participação",
      pontos: 10,
      dataLancamento: new Date("2025-01-01T00:00:00.000Z"),
    });

    const res = await request(app).post("/api/movimentacoes-pontuacao").send({
      idEvento: 1,
      idEquipe: 1,
      tipo: "PONTUACAO",
      descricao: "Pontuação por participação",
      pontos: 10,
    });

    expect(res.status).toBe(201);
    expect(res.body.tipo).toBe("PONTUACAO");
  });

  it("deve criar usuário pela rota /api/usuarios", async () => {
    vi.spyOn(UsuarioRepository.prototype, "criar").mockResolvedValue({
      id: 1,
      dataCriacao: new Date("2025-01-01T00:00:00.000Z"),
      nome: "Usuário Teste",
      senhaHash: "hash-da-senha",
    });

    const res = await request(app).post("/api/usuarios").send({
      nome: "Usuário Teste",
      senhaHash: "hash-da-senha",
    });

    expect(res.status).toBe(201);
    expect(res.body.nome).toBe("Usuário Teste");
  });

  it("deve deletar usuário pela rota /api/usuarios/:id retornando 204", async () => {
    vi.spyOn(UsuarioRepository.prototype, "buscarPorId").mockResolvedValue({
      id: 2,
      dataCriacao: new Date("2025-01-01T00:00:00.000Z"),
      nome: "Usuário X",
      senhaHash: "hash",
    });
    vi.spyOn(UsuarioRepository.prototype, "deletar").mockResolvedValue(undefined);

    const res = await request(app).delete("/api/usuarios/2");
    expect(res.status).toBe(204);
  });

  it("deve atualizar usuário pela rota /api/usuarios/:id retornando 200", async () => {
    vi.spyOn(UsuarioRepository.prototype, "alterar").mockResolvedValue({
      id: 3,
      dataCriacao: new Date("2025-01-01T00:00:00.000Z"),
      nome: "Usuário Atualizado",
      senhaHash: "novo-hash",
    });

    const res = await request(app).put("/api/usuarios/3").send({
      nome: "Usuário Atualizado",
      senhaHash: "novo-hash",
    });

    expect(res.status).toBe(200);
    expect(res.body.nome).toBe("Usuário Atualizado");
  });
});
