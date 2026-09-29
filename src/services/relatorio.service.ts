import { RelatorioRepository } from "../repositories/relatorio.repository";
import type {
  CategoriaRelatorio,
  EquipeRelatorio,
  RelatorioEvento,
} from "../types/relatorio";

export class RelatorioService {
  constructor(private readonly repository: RelatorioRepository) {}

  async gerarPorEvento(eventoId: number): Promise<RelatorioEvento> {
    const linhas = await this.repository.listarPorEvento(eventoId);
    const equipes = new Map<number, EquipeRelatorio>();

    for (const linha of linhas) {
      let equipe = equipes.get(linha.equipeId);
      if (!equipe) {
        equipe = {
          id: linha.equipeId,
          nome: linha.equipeNome,
          categorias: [],
          totalNotas: 0,
        };
        equipes.set(linha.equipeId, equipe);
      }

      let categoria = equipe.categorias.find(
        (item) => item.id === linha.categoriaId,
      );
      if (!categoria) {
        categoria = {
          id: linha.categoriaId,
          nome: linha.categoriaNome,
          ordem: linha.categoriaOrdem,
          criterios: [],
          totalNotas: 0,
        };
        equipe.categorias.push(categoria);
      }

      categoria.criterios.push({
        id: linha.criterioId,
        nome: linha.criterioNome,
        ordem: linha.criterioOrdem,
        totalNotas: linha.totalNotas,
      });
      categoria.totalNotas += linha.totalNotas;
      equipe.totalNotas += linha.totalNotas;
    }

    return { eventoId, equipes: [...equipes.values()] };
  }
}
