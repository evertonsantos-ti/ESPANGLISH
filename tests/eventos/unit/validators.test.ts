import { describe, expect, it } from "vitest";

import { validatorAvaliacao } from "../../../src/utils/validators/avaliacoes.validator";
import { validatorCategoria } from "../../../src/utils/validators/categorias.validator";
import { validatorCriterio } from "../../../src/utils/validators/criterios.validator";
import { validatorEquipe } from "../../../src/utils/validators/equipes.validator";
import { validatorEvento } from "../../../src/utils/validators/eventos.validator";
import { validatorJurado } from "../../../src/utils/validators/jurados.validator";
import { validatorJuradoCategoria } from "../../../src/utils/validators/juradoCategorias.validator";
import { validatorMovimentacaoPontuacao } from "../../../src/utils/validators/movimentacoesPontuacao.validator";
import { validatorNota } from "../../../src/utils/validators/notas.validator";
import { ValidationError } from "../../../src/utils/error";

describe("Validadores dos módulos", () => {
  it("deve aceitar um evento válido", () => {
    const dados = {
      nome: "Evento de teste",
      dataInicio: "2025-01-01",
      dataFim: "2025-01-10",
      competencia: 2025,
    };

    expect(validatorEvento(dados, "criar")).toEqual({
      nome: "Evento de teste",
      dataInicio: new Date("2025-01-01"),
      dataFim: new Date("2025-01-10"),
      competencia: 2025,
    });
  });

  it("deve rejeitar payload de evento com campos fora do padrão e erro ortográfico do payload", () => {
    expect(() =>
      validatorEvento(
        { nomee: "Evento", dataInicio: "2025-01-01", dataFim: "2025-01-10", competencia: 2025 },
        "criar",
      ),
    ).toThrow(ValidationError);

    expect(() =>
      validatorEvento(
        { nome: "", dataInicio: "2025-01-01", dataFim: "2025-01-10", competencia: 2025 },
        "criar",
      ),
    ).toThrow("O nome do evento está fora do padrão");

    expect(() =>
      validatorEvento(
        { nome: "Evento", dataInicio: "2025-01-10", dataFim: "2025-01-01", competencia: 2025 },
        "criar",
      ),
    ).toThrow("Data final não pode ser anterior a data incial");

    expect(() =>
      validatorEvento(
        { nome: "Evento", dataInicio: "2025-01-01", dataFim: "2025-01-10", competencia: 2019 },
        "criar",
      ),
    ).toThrow("Compentência com o valor fora do permitido");
  });

  it("deve aceitar e rejeitar equipe com payload de typo", () => {
    expect(
      validatorEquipe({ idEvento: 1, nome: "Equipe A" }),
    ).toEqual({ idEvento: 1, nome: "Equipe A" });

    expect(() => validatorEquipe({ idEvent: 1, nomee: "Equipe A" })).toThrow(
      ValidationError,
    );

    expect(() => validatorEquipe({ idEvento: 1, nome: "" })).toThrow(
      "O nome da equipe está fora do padrão!",
    );
  });

  it("deve validar categoria e rejeitar typo no campo evento", () => {
    expect(
      validatorCategoria({ idEvento: 1, nome: "Categoria A", ordem: 1 }, "criar"),
    ).toEqual({ idEvento: 1, nome: "Categoria A", ordem: 1 });

    expect(() =>
      validatorCategoria({ idEvent: 1, nome: "Categoria A", ordem: 1 }, "criar"),
    ).toThrow("(ID) do evento inválido");

    expect(() =>
      validatorCategoria({ idEvento: 1, nome: "", ordem: 1 }, "criar"),
    ).toThrow("O nome da categoria está fora do padrão!");
  });

  it("deve validar criterio com payload typo e ordem inválida", () => {
    expect(
      validatorCriterio({ idCategoria: 1, nome: "Critério A", ordem: 2 }, "criar"),
    ).toEqual({ idCategoria: 1, nome: "Critério A", ordem: 2 });

    expect(() =>
      validatorCriterio({ idCategria: 1, nome: "Critério A", ordem: 2 }, "criar"),
    ).toThrow("(ID) da categoria inválido");

    expect(() =>
      validatorCriterio({ idCategoria: 1, nome: "", ordem: 2 }, "criar"),
    ).toThrow("O nome do critério está fora do padrão!");
  });

  it("deve validar jurado com payload typo e ativo em atualizar", () => {
    expect(validatorJurado({ idEvento: 4, nome: "Jurado 1" }, "criar")).toEqual({
      idEvento: 4,
      nome: "Jurado 1",
    });

    expect(() => validatorJurado({ idEvent: 4, nome: "Jurado 1" }, "criar")).toThrow(
      "(ID) do evento inválido",
    );

    expect(
      validatorJurado({ idEvento: 4, nome: "Jurado 1", ativo: true }, "atualizar"),
    ).toEqual({ idEvento: 4, nome: "Jurado 1", ativo: true });
  });

  it("deve validar associação jurado-categoria e rejeitar typo em campo de jurado", () => {
    expect(validatorJuradoCategoria({ idJurado: 2, idCategoria: 3 })).toEqual({
      idJurado: 2,
      idCategoria: 3,
    });

    expect(() => validatorJuradoCategoria({ idJuradoX: 2, idCategoria: 3 })).toThrow(
      "(ID) do jurado inválido",
    );
  });

  it("deve validar avaliação e rejeitar ids inválidos", () => {
    expect(validatorAvaliacao({ idEquipe: 2, idCategoria: 3, idJurado: 4 })).toEqual({
      idEquipe: 2,
      idCategoria: 3,
      idJurado: 4,
    });

    expect(() =>
      validatorAvaliacao({ idEqupe: 2, idCategoria: 3, idJurado: 4 }),
    ).toThrow("(ID) da equipe inválido");
  });

  it("deve validar nota dentro do intervalo e rejeitar valores fora do permitido", () => {
    expect(validatorNota({ idAvaliacao: 1, idCriterio: 2, nota: 50 })).toEqual({
      idAvaliacao: 1,
      idCriterio: 2,
      nota: 50,
    });

    expect(() => validatorNota({ idAvaliacao: 1, idCriterio: 2, nota: -1 })).toThrow(
      "Valor da nota fora do intervalo permitido",
    );

    expect(() => validatorNota({ idAvaliacao: 1, idCriterio: 2, nota: 101 })).toThrow(
      "Valor da nota fora do intervalo permitido",
    );
  });

  it("deve validar tipo de movimentação e detectar ortografia no tipo", () => {
    expect(
      validatorMovimentacaoPontuacao({
        idEvento: 1,
        idEquipe: 2,
        tipo: "bonus",
        descricao: "Acerto",
        pontos: 10,
      }),
    ).toEqual({
      idEvento: 1,
      idEquipe: 2,
      tipo: "BONUS",
      descricao: "Acerto",
      pontos: 10,
    });

    expect(() =>
      validatorMovimentacaoPontuacao({
        idEvento: 1,
        idEquipe: 2,
        tipo: "BONU S",
        descricao: "Acerto",
        pontos: 10,
      }),
    ).toThrow("Tipo desconhecido");

    expect(() =>
      validatorMovimentacaoPontuacao({
        idEvento: 1,
        idEquipe: 2,
        tipo: "PONTUACAO",
        descricao: "",
        pontos: 10,
      }),
    ).toThrow("Descrição inválida");
  });
});
