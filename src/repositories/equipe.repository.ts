import { Equipe, CriarEquipe } from "../types/equipe";
import { execute, query, queryOne } from "../database/query";

interface EquipeRow {
  ID: number;
  EVENTO_ID: number;
  NOME: string;
}

export class EquipeRepository {}
