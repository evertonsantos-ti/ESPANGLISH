import "dotenv/config";
import * as Firebird from "node-firebird";
import mysql, { type PoolConnection, type RowDataPacket } from "mysql2/promise";

type LinhaFirebird = Record<string, unknown>;

type Tabela = {
  nome: string;
  select: string;
  colunas: string[];
  valores: (linha: LinhaFirebird) => unknown[];
};

interface ContagemRow extends RowDataPacket {
  TOTAL: number;
}

interface ProximoIdRow extends RowDataPacket {
  PROXIMO_ID: number;
}

function obrigatorio(nome: string): string {
  const valor = process.env[nome];
  if (!valor) {
    throw new Error(`A variável ${nome} deve ser configurada para a migração.`);
  }
  return valor;
}

function numero(valor: unknown, campo: string): number {
  const convertido = Number(valor);
  if (!Number.isFinite(convertido)) {
    throw new Error(`Valor inválido para ${campo}: ${String(valor)}`);
  }
  return convertido;
}

function texto(valor: unknown, campo: string): string {
  if (typeof valor !== "string") {
    throw new Error(`Valor inválido para ${campo}: ${String(valor)}`);
  }
  return valor;
}

function booleano(valor: unknown): number {
  return valor === true || valor === 1 || valor === "1" ? 1 : 0;
}

function dataOuAgora(valor: unknown): unknown {
  return valor ?? new Date();
}

const tabelas: Tabela[] = [
  {
    nome: "USUARIO",
    select: "SELECT ID, DATA_CRIACAO, NOME, SENHA_HASH FROM USUARIO ORDER BY ID",
    colunas: ["ID", "DATA_CRIACAO", "NOME", "SENHA_HASH"],
    valores: (linha) => [
      numero(linha.ID, "USUARIO.ID"),
      linha.DATA_CRIACAO,
      texto(linha.NOME, "USUARIO.NOME"),
      texto(linha.SENHA_HASH, "USUARIO.SENHA_HASH"),
    ],
  },
  {
    nome: "EVENTO",
    select:
      "SELECT ID, NOME, COMPETENCIA, DATA_INICIO, DATA_FIM, ATIVO, DATA_CRIACAO FROM EVENTO ORDER BY ID",
    colunas: [
      "ID",
      "NOME",
      "COMPETENCIA",
      "DATA_INICIO",
      "DATA_FIM",
      "ATIVO",
      "DATA_CRIACAO",
    ],
    valores: (linha) => [
      numero(linha.ID, "EVENTO.ID"),
      texto(linha.NOME, "EVENTO.NOME"),
      numero(linha.COMPETENCIA, "EVENTO.COMPETENCIA"),
      linha.DATA_INICIO,
      linha.DATA_FIM,
      booleano(linha.ATIVO),
      dataOuAgora(linha.DATA_CRIACAO),
    ],
  },
  {
    nome: "EQUIPE",
    select: "SELECT ID, EVENTO_ID, NOME FROM EQUIPE ORDER BY ID",
    colunas: ["ID", "EVENTO_ID", "NOME"],
    valores: (linha) => [
      numero(linha.ID, "EQUIPE.ID"),
      numero(linha.EVENTO_ID, "EQUIPE.EVENTO_ID"),
      texto(linha.NOME, "EQUIPE.NOME"),
    ],
  },
  {
    nome: "CATEGORIA",
    select: "SELECT ID, EVENTO_ID, NOME, ORDEM, ATIVO FROM CATEGORIA ORDER BY ID",
    colunas: ["ID", "EVENTO_ID", "NOME", "ORDEM", "ATIVO"],
    valores: (linha) => [
      numero(linha.ID, "CATEGORIA.ID"),
      numero(linha.EVENTO_ID, "CATEGORIA.EVENTO_ID"),
      texto(linha.NOME, "CATEGORIA.NOME"),
      numero(linha.ORDEM, "CATEGORIA.ORDEM"),
      booleano(linha.ATIVO),
    ],
  },
  {
    nome: "CRITERIO",
    select: "SELECT ID, CATEGORIA_ID, NOME, ORDEM, ATIVO FROM CRITERIO ORDER BY ID",
    colunas: ["ID", "CATEGORIA_ID", "NOME", "ORDEM", "ATIVO"],
    valores: (linha) => [
      numero(linha.ID, "CRITERIO.ID"),
      numero(linha.CATEGORIA_ID, "CRITERIO.CATEGORIA_ID"),
      texto(linha.NOME, "CRITERIO.NOME"),
      numero(linha.ORDEM, "CRITERIO.ORDEM"),
      booleano(linha.ATIVO),
    ],
  },
  {
    nome: "JURADO",
    select: "SELECT ID, EVENTO_ID, NOME, LOGIN, ATIVO FROM JURADO ORDER BY ID",
    colunas: ["ID", "EVENTO_ID", "NOME", "LOGIN", "ATIVO"],
    valores: (linha) => [
      numero(linha.ID, "JURADO.ID"),
      numero(linha.EVENTO_ID, "JURADO.EVENTO_ID"),
      texto(linha.NOME, "JURADO.NOME"),
      texto(linha.LOGIN, "JURADO.LOGIN"),
      booleano(linha.ATIVO),
    ],
  },
  {
    nome: "JURADO_CATEGORIA",
    select: "SELECT ID, JURADO_ID, CATEGORIA_ID FROM JURADO_CATEGORIA ORDER BY ID",
    colunas: ["ID", "JURADO_ID", "CATEGORIA_ID"],
    valores: (linha) => [
      numero(linha.ID, "JURADO_CATEGORIA.ID"),
      numero(linha.JURADO_ID, "JURADO_CATEGORIA.JURADO_ID"),
      numero(linha.CATEGORIA_ID, "JURADO_CATEGORIA.CATEGORIA_ID"),
    ],
  },
  {
    nome: "AVALIACAO",
    select: "SELECT ID, EQUIPE_ID, CATEGORIA_ID, JURADO_ID FROM AVALIACAO ORDER BY ID",
    colunas: ["ID", "EQUIPE_ID", "CATEGORIA_ID", "JURADO_ID"],
    valores: (linha) => [
      numero(linha.ID, "AVALIACAO.ID"),
      numero(linha.EQUIPE_ID, "AVALIACAO.EQUIPE_ID"),
      numero(linha.CATEGORIA_ID, "AVALIACAO.CATEGORIA_ID"),
      numero(linha.JURADO_ID, "AVALIACAO.JURADO_ID"),
    ],
  },
  {
    nome: "NOTA",
    select: "SELECT ID, AVALIACAO_ID, CRITERIO_ID, NOTA FROM NOTA ORDER BY ID",
    colunas: ["ID", "AVALIACAO_ID", "CRITERIO_ID", "NOTA"],
    valores: (linha) => [
      numero(linha.ID, "NOTA.ID"),
      numero(linha.AVALIACAO_ID, "NOTA.AVALIACAO_ID"),
      numero(linha.CRITERIO_ID, "NOTA.CRITERIO_ID"),
      numero(linha.NOTA, "NOTA.NOTA"),
    ],
  },
  {
    nome: "MOVIMENTACAO_PONTUACAO",
    select:
      "SELECT ID, EVENTO_ID, EQUIPE_ID, TIPO, DESCRICAO, PONTOS, DATA_LANCAMENTO FROM MOVIMENTACAO_PONTUACAO ORDER BY ID",
    colunas: [
      "ID",
      "EVENTO_ID",
      "EQUIPE_ID",
      "TIPO",
      "DESCRICAO",
      "PONTOS",
      "DATA_LANCAMENTO",
    ],
    valores: (linha) => [
      numero(linha.ID, "MOVIMENTACAO_PONTUACAO.ID"),
      numero(linha.EVENTO_ID, "MOVIMENTACAO_PONTUACAO.EVENTO_ID"),
      numero(linha.EQUIPE_ID, "MOVIMENTACAO_PONTUACAO.EQUIPE_ID"),
      texto(linha.TIPO, "MOVIMENTACAO_PONTUACAO.TIPO"),
      texto(linha.DESCRICAO, "MOVIMENTACAO_PONTUACAO.DESCRICAO"),
      numero(linha.PONTOS, "MOVIMENTACAO_PONTUACAO.PONTOS"),
      dataOuAgora(linha.DATA_LANCAMENTO),
    ],
  },
];

const firebirdOptions: Firebird.Options = {
  host: obrigatorio("FB_HOST"),
  port: Number(process.env.FB_PORT ?? 3050),
  database: obrigatorio("FB_DATABASE"),
  user: obrigatorio("FB_USER"),
  password: obrigatorio("FB_PASSWORD"),
  role: process.env.FB_ROLE,
  lowercase_keys: false,
};

const mysqlPool = mysql.createPool({
  host: obrigatorio("DB_HOST"),
  port: Number(process.env.DB_PORT ?? 3306),
  database: obrigatorio("DB_DATABASE"),
  user: obrigatorio("DB_USER"),
  password: obrigatorio("DB_PASSWORD"),
  waitForConnections: true,
  connectionLimit: 1,
});

function conectarFirebird(): Promise<Firebird.Database> {
  return new Promise((resolve, reject) => {
    Firebird.attach(firebirdOptions, (erro, banco) => {
      if (erro) {
        reject(erro);
        return;
      }
      if (!banco) {
        reject(new Error("Não foi possível abrir o banco Firebird."));
        return;
      }
      resolve(banco);
    });
  });
}

function consultarFirebird(
  banco: Firebird.Database,
  sql: string,
): Promise<LinhaFirebird[]> {
  return new Promise((resolve, reject) => {
    banco.query(sql, [], (erro, registros) => {
      if (erro) {
        reject(erro);
        return;
      }
      resolve(registros as LinhaFirebird[]);
    });
  });
}

async function garantirMysqlVazio(conexao: PoolConnection): Promise<void> {
  for (const tabela of tabelas) {
    const [registros] = await conexao.query<ContagemRow[]>(
      `SELECT COUNT(*) AS TOTAL FROM \`${tabela.nome}\``,
    );
    if (registros[0].TOTAL > 0) {
      throw new Error(
        `A tabela ${tabela.nome} já possui dados. A migração só pode ser executada em um banco MySQL vazio.`,
      );
    }
  }
}

async function importarTabela(
  conexao: PoolConnection,
  bancoFirebird: Firebird.Database,
  tabela: Tabela,
): Promise<number> {
  const registros = await consultarFirebird(bancoFirebird, tabela.select);
  if (registros.length === 0) return 0;

  const colunas = tabela.colunas.map((coluna) => `\`${coluna}\``).join(", ");
  const marcadores = tabela.colunas.map(() => "?").join(", ");
  const sql = `INSERT INTO \`${tabela.nome}\` (${colunas}) VALUES (${marcadores})`;

  for (const registro of registros) {
    await conexao.execute(sql, tabela.valores(registro) as any[]);
  }

  return registros.length;
}

async function ajustarAutoIncrement(tabela: Tabela): Promise<void> {
  const [registros] = await mysqlPool.query<ProximoIdRow[]>(
    `SELECT COALESCE(MAX(ID), 0) + 1 AS PROXIMO_ID FROM \`${tabela.nome}\``,
  );
  const proximoId = numero(registros[0].PROXIMO_ID, `${tabela.nome}.PROXIMO_ID`);
  await mysqlPool.query(
    `ALTER TABLE \`${tabela.nome}\` AUTO_INCREMENT = ${Math.max(1, proximoId)}`,
  );
}

async function main(): Promise<void> {
  const bancoFirebird = await conectarFirebird();
  const conexaoMysql = await mysqlPool.getConnection();

  try {
    await garantirMysqlVazio(conexaoMysql);
    await conexaoMysql.beginTransaction();

    for (const tabela of tabelas) {
      const total = await importarTabela(conexaoMysql, bancoFirebird, tabela);
      console.log(`${tabela.nome}: ${total} registro(s) importado(s).`);
    }

    await conexaoMysql.commit();

    for (const tabela of tabelas) {
      await ajustarAutoIncrement(tabela);
    }

    console.log("Migração concluída com sucesso.");
  } catch (erro) {
    await conexaoMysql.rollback();
    throw erro;
  } finally {
    conexaoMysql.release();
    bancoFirebird.detach();
    await mysqlPool.end();
  }
}

main().catch((erro: unknown) => {
  console.error("Migração interrompida:", erro);
  process.exitCode = 1;
});
