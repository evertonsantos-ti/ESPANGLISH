import { describe, expect, it, vi } from "vitest";
import { RelatorioService } from "../../src/services/relatorio.service";

describe("RelatorioService", () => {
  it("agrupa critérios por categoria e soma as notas sem repetir linhas", async () => {
    const repository = {
      listarPorEvento: vi.fn().mockResolvedValue([
        { equipeId: 1, equipeNome: "Equipe A", categoriaId: 10, categoriaNome: "Dança", categoriaOrdem: 1, criterioId: 100, criterioNome: "Técnica", criterioOrdem: 1, totalNotas: 160 },
        { equipeId: 1, equipeNome: "Equipe A", categoriaId: 10, categoriaNome: "Dança", categoriaOrdem: 1, criterioId: 101, criterioNome: "Criatividade", criterioOrdem: 2, totalNotas: 170 },
        { equipeId: 1, equipeNome: "Equipe A", categoriaId: 20, categoriaNome: "Teatro", categoriaOrdem: 2, criterioId: 200, criterioNome: "Interpretação", criterioOrdem: 1, totalNotas: 90 },
      ]),
    };
    const service = new RelatorioService(repository as never);

    await expect(service.gerarPorEvento(7)).resolves.toEqual({
      eventoId: 7,
      equipes: [{
        id: 1,
        nome: "Equipe A",
        totalNotas: 420,
        categorias: [
          { id: 10, nome: "Dança", ordem: 1, totalNotas: 330, criterios: [
            { id: 100, nome: "Técnica", ordem: 1, totalNotas: 160 },
            { id: 101, nome: "Criatividade", ordem: 2, totalNotas: 170 },
          ] },
          { id: 20, nome: "Teatro", ordem: 2, totalNotas: 90, criterios: [
            { id: 200, nome: "Interpretação", ordem: 1, totalNotas: 90 },
          ] },
        ],
      }],
    });
  });
});
