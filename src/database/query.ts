import { pool } from "./connection";

export function query<T = unknown>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    pool.get((error, db) => {
      if (error) {
        reject(error);
        return;
      }

      db.query(sql, params, (queryError, results) => {
        db.detach();

        if (queryError) {
          reject(queryError);
          return;
        }

        resolve(results as T[]);
      });
    });
  });
}

export function queryOne<T = unknown>(
  sql: string,
  params: unknown[] = [],
): Promise<T> {
  return new Promise((resolve, reject) => {
    pool.get((error, db) => {
      if (error) {
        reject(error);
        return;
      }
      db.query(sql, params, (queryError, result) => {
        db.detach();

        if (queryError) {
          reject(queryError);
          return;
        }

        resolve(result as T);
      });
    });
  });
}
