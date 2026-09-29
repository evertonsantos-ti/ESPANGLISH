import { AtualizarEvento, CriarEvento } from "../../types/evento";
import { ValidationError } from "../error";

function parseData(data: string): Date {
  const [ano, mes, dia] = data.split("-").map(Number);

  const resultado = new Date(Date.UTC(ano, mes - 1, dia));

  if (
    resultado.getUTCFullYear() !== ano ||
    resultado.getUTCMonth() !== mes - 1 ||
    resultado.getUTCDate() !== dia
  ) {
    throw new ValidationError("Data inválida");
  }

  return resultado;
}

export function validatorEvento(body: unknown, tipo: "criar"): CriarEvento;
export function validatorEvento(
  body: unknown,
  tipo: "atualizar",
): AtualizarEvento;

export function validatorEvento(
  body: unknown,
  tipo: "criar" | "atualizar",
): CriarEvento | AtualizarEvento {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Dados do evento inválidos");
  }

  const dados = body as Record<string, unknown>;

  // Validar NOME
  if (typeof dados.nome !== "string") {
    throw new ValidationError("Nome do evento inválido");
  }
  if (dados.nome.trim() === "" || dados.nome.length > 100) {
    throw new ValidationError("O nome do evento está fora do padrão");
  }

  // Validar DATAS
  if (
    typeof dados.dataInicio !== "string" ||
    typeof dados.dataFim !== "string"
  ) {
    throw new ValidationError("Verifique a data inicial e a data final!");
  }

  const dataInicio = parseData(dados.dataInicio);
  const dataFim = parseData(dados.dataFim);

  if (isNaN(dataInicio.getTime())) {
    throw new ValidationError("Data inicial inválida");
  }

  if (isNaN(dataFim.getTime())) {
    throw new ValidationError("Data final inválida");
  }

  if (dataFim < dataInicio) {
    throw new ValidationError("Data final não pode ser anterior a data incial");
  }

  // Validar COMPETENCIA
  const competencia = dados.competencia;
  if (typeof competencia !== "number") {
    throw new ValidationError("Competência com formato inválido!");
  }
  if (competencia < 2020 || competencia > 2100) {
    throw new ValidationError(
      "Compentência com o valor fora do permitido, apenas anos entre (2020 - 2100)",
    );
  }
  const evento = {
    nome: dados.nome,
    competencia,
    dataInicio,
    dataFim,
  };
  // Validar ATIVO
  if (tipo === "atualizar") {
    if (typeof dados.ativo !== "boolean") {
      throw new ValidationError(
        "O campo (ATIVO) está com valor diferente do esperado!",
      );
    }
    return {
      ...evento,
      ativo: dados.ativo,
    };
  }
  return evento;
}
