import { CriarMovimentacaoPontuacao } from "../../types/movimentacaoPontuacao";
import { ValidationError } from "../error";

export function validatorMovimentacaoPontuacao(body: unknown): CriarMovimentacaoPontuacao {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Dados da movimentação inválidos");
  }

  const dados = body as Record<string, unknown>;

  if (typeof dados.idEvento !== "number") {
    throw new ValidationError("(ID) do evento inválido");
  }

  if (typeof dados.idEquipe !== "number") {
    throw new ValidationError("(ID) da equipe inválido");
  }

  if (typeof dados.tipo !== "string") {
    throw new ValidationError("Tipo inválido");
  }

  const tipo = (dados.tipo as string).toUpperCase();
  if (!["BONUS", "PENALIDADE", "PONTUACAO"].includes(tipo)) {
    throw new ValidationError("Tipo desconhecido. Deve ser BONU S, PENALIDADE ou PONTUACAO");
  }

  if (typeof dados.descricao !== "string" || dados.descricao.trim() === "") {
    throw new ValidationError("Descrição inválida");
  }

  if (typeof dados.pontos !== "number" || dados.pontos === 0) {
    throw new ValidationError("Pontos inválidos (não pode ser 0)");
  }

  return {
    idEvento: dados.idEvento as number,
    idEquipe: dados.idEquipe as number,
    tipo: tipo,
    descricao: dados.descricao as string,
    pontos: dados.pontos as number,
  };
}
