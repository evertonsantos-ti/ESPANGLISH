import { describe, expect, it, vi } from "vitest";
import { AvaliacaoService } from "../../src/services/avaliacao.service";
import { NotFoundError, ValidationError } from "../../src/utils/error";

describe("AvaliacaoService.criar", () => {
  const dados = { idEquipe: 2, idCategoria: 1, idJurado: 1000 };

  it("persiste uma avaliação somente quando os vínculos pertencem ao mesmo evento", async () => {
    const repository = {
      relacionamentosValidos: vi.fn().mockResolvedValue(true),
      criar: vi.fn().mockResolvedValue({ id: 1, ...dados }),
    };
    const service = new AvaliacaoService(repository as never);

    await expect(service.criar(dados)).resolves.toEqual({ id: 1, ...dados });
    expect(repository.criar).toHaveBeenCalledWith(dados);
  });

  it("rejeita uma avaliação que mistura registros de eventos distintos", async () => {
    const repository = {
      relacionamentosValidos: vi.fn().mockResolvedValue(false),
      criar: vi.fn(),
    };
    const service = new AvaliacaoService(repository as never);

    await expect(service.criar(dados)).rejects.toBeInstanceOf(ValidationError);
    expect(repository.criar).not.toHaveBeenCalled();
  });
});

describe("AvaliacaoService.deletar", () => {
  it("remove a avaliação e suas notas por meio do repositório", async () => {
    const repository = { deletar: vi.fn().mockResolvedValue(true) };
    const service = new AvaliacaoService(repository as never);
    await expect(service.deletar(1)).resolves.toBeUndefined();
    expect(repository.deletar).toHaveBeenCalledWith(1);
  });

  it("informa quando a avaliação não existe", async () => {
    const repository = { deletar: vi.fn().mockResolvedValue(false) };
    const service = new AvaliacaoService(repository as never);
    await expect(service.deletar(1)).rejects.toBeInstanceOf(NotFoundError);
  });
});
