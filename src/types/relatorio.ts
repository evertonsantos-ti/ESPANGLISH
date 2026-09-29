export interface CriterioRelatorio {
  id: number;
  nome: string;
  ordem: number;
  totalNotas: number;
}

export interface CategoriaRelatorio {
  id: number;
  nome: string;
  ordem: number;
  criterios: CriterioRelatorio[];
  totalNotas: number;
}

export interface EquipeRelatorio {
  id: number;
  nome: string;
  categorias: CategoriaRelatorio[];
  totalNotas: number;
}

export interface RelatorioEvento {
  eventoId: number;
  equipes: EquipeRelatorio[];
}
