import { describe, expect, it, vi } from "vitest";
import { JuradoCategoriaService } from "../../src/services/juradoCategoria.service";
import { NotFoundError, ValidationError } from "../../src/utils/error";

describe("JuradoCategoriaService.criar", () => {
  it("cria a atribuição com as avaliações de todas as equipes", async () => {
    const repository = {
      criarComAvaliacoes: vi.fn().mockResolvedValue({
        id: 10,
        idJurado: 2,
        idCategoria: 3,
      }),
    };
    const service = new JuradoCategoriaService(repository as never);

    await expect(
      service.criar({ idJurado: 2, idCategoria: 3 }),
    ).resolves.toEqual({ id: 10, idJurado: 2, idCategoria: 3 });
    expect(repository.criarComAvaliacoes).toHaveBeenCalledWith({
      idJurado: 2,
      idCategoria: 3,
    });
  });

  it("rejeita jurado e categoria de eventos diferentes ou inativos", async () => {
    const repository = { criarComAvaliacoes: vi.fn().mockResolvedValue(null) };
    const service = new JuradoCategoriaService(repository as never);

    await expect(
      service.criar({ idJurado: 2, idCategoria: 3 }),
    ).rejects.toBeInstanceOf(ValidationError);
  });
});

describe("JuradoCategoriaService.deletar", () => {
  it("remove uma atribuição existente", async () => {
    const repository = { deletar: vi.fn().mockResolvedValue(true) };
    const service = new JuradoCategoriaService(repository as never);
    await expect(service.deletar(1)).resolves.toBeUndefined();
  });

  it("rejeita uma atribuição inexistente", async () => {
    const repository = { deletar: vi.fn().mockResolvedValue(false) };
    const service = new JuradoCategoriaService(repository as never);
    await expect(service.deletar(1)).rejects.toBeInstanceOf(NotFoundError);
  });
});
