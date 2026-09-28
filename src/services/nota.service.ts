import { NotaRepository } from "../repositories/nota.repository";
import { Nota, CriarNota } from "../types/nota";
import { NotFoundError, ValidationError } from "../utils/error";

export class NotaService {
  constructor(private readonly repository: NotaRepository) {}

  async listar(): Promise<Nota[]> {
    return this.repository.listar();
  }

  async buscarPorId(id: number): Promise<Nota | null> {
    return this.repository.buscarPorId(id);
  }

  async listarPorJurado(idJurado: number, eventoId: number): Promise<Nota[]> {
    return this.repository.listarPorJurado(idJurado, eventoId);
  }

  async buscarPorIdJurado(
    id: number,
    idJurado: number,
    eventoId: number,
  ): Promise<Nota | null> {
    return this.repository.notaDoJurado(id, idJurado, eventoId);
  }

  private async validarAvaliacaoECriterio(
    dados: CriarNota,
    idJurado: number,
    eventoId: number,
  ): Promise<void> {
    const avaliacao = await this.repository.avaliacaoDoJurado(
      dados.idAvaliacao,
      idJurado,
      eventoId,
    );
    if (!avaliacao) {
      throw new NotFoundError("Avaliação não encontrada para este jurado.");
    }
    if (
      !(await this.repository.criterioDaCategoria(
        dados.idCriterio,
        avaliacao.idCategoria,
      ))
    ) {
      throw new ValidationError(
        "O critério não pertence à categoria da avaliação.",
      );
    }
  }

  async criar(dados: CriarNota): Promise<Nota> {
    return this.repository.criar(dados);
  }

  async criarParaJurado(
    dados: CriarNota,
    idJurado: number,
    eventoId: number,
  ): Promise<Nota> {
    await this.validarAvaliacaoECriterio(dados, idJurado, eventoId);
    return this.repository.criar(dados);
  }

  async alterar(id: number, dados: CriarNota): Promise<Nota | null> {
    const nota = await this.repository.alterar(id, dados);
    if (!nota) throw new NotFoundError("Não há nota com este (ID)!");
    return nota;
  }

  async alterarParaJurado(
    id: number,
    dados: CriarNota,
    idJurado: number,
    eventoId: number,
  ): Promise<Nota | null> {
    if (!(await this.repository.notaDoJurado(id, idJurado, eventoId))) {
      throw new NotFoundError("Nota não encontrada para este jurado.");
    }
    await this.validarAvaliacaoECriterio(dados, idJurado, eventoId);
    const nota = await this.repository.alterar(id, dados);
    if (!nota) throw new NotFoundError("Não há nota com este (ID)!");
    return nota;
  }
}
