import mysql from "mysql2/promise";
import { config } from "../config";

export const pool = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  database: config.database.database,
  password: config.database.password,
  waitForConnections: true,
  connectionLimit: 5,
  idleTimeout: 6000,
});

export function testConnection(): Promise<void> {
  return pool.query("SELECT 1").then(() => undefined);
}
