import type { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { pool } from "./connection";

export async function query<T = unknown>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}

export async function queryOne<T = unknown>(
  sql: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

export async function execute(
  sql: string,
  params: unknown[] = [],
): Promise<ResultSetHeader> {
  const [result] = await pool.execute(sql, params as any[]);
  return result as ResultSetHeader;
}

export interface Transaction {
  query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]>;
  queryOne<T = unknown>(sql: string, params?: unknown[]): Promise<T | null>;
  execute(sql: string, params?: unknown[]): Promise<ResultSetHeader>;
}

function criarTransacao(conexao: PoolConnection): Transaction {
  const consultar = async <T = unknown>(
    sql: string,
    params: unknown[] = [],
  ): Promise<T[]> => {
    const [rows] = await conexao.query(sql, params);
    return rows as T[];
  };

  return {
    query: consultar,
    async queryOne<T = unknown>(sql: string, params: unknown[] = []): Promise<T | null> {
      const rows = await consultar<T>(sql, params);
      return rows[0] ?? null;
    },
    async execute(sql: string, params: unknown[] = []): Promise<ResultSetHeader> {
      const [result] = await conexao.execute(sql, params as any[]);
      return result as ResultSetHeader;
    },
  };
}

export async function withTransaction<T>(
  operacao: (transaction: Transaction) => Promise<T>,
): Promise<T> {
  const conexao = await pool.getConnection();

  try {
    await conexao.beginTransaction();
    const resultado = await operacao(criarTransacao(conexao));
    await conexao.commit();
    return resultado;
  } catch (erro) {
    await conexao.rollback();
    throw erro;
  } finally {
    conexao.release();
  }
}
