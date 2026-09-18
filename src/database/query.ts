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
): Promise<T | null> {
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

        if (Array.isArray(result)) {
          if (result.length === 0) {
            resolve(null);
            return;
          }

          resolve(result[0] as T);
          return;
        }

        resolve(result as T);
      });
    });
  });
}
