import * as Firebird from "node-firebird";
import { config } from "../controllers/config";

const options: Firebird.Options = {
  host: config.database.host,
  port: config.database.port,
  database: config.database.database,
  user: config.database.user,
  password: config.database.password,
  role: config.database.role,
};

export const pool = Firebird.pool(5, options);

export function testConnection(): Promise<void> {
  return new Promise((resolve, reject) => {
    pool.get((error, db) => {
      if (error) {
        reject(error);
        return;
      }

      db.query("SELECT 1 FROM RDB$DATABASE", (queryError) => {
        db.detach();

        if (queryError) {
          reject(queryError);
          return;
        }

        resolve();
      });
    });
  });
}
