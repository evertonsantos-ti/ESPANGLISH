import "dotenv/config";
import type { SignOptions } from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET não configurado!");
}

function getJwtExpiresIn(): SignOptions["expiresIn"] {
  const value = process.env.JWT_EXPIRES_IN;

  if (!value) {
    return "1h";
  }

  if (!/^\d+(s|m|h|d)$/.test(value)) {
    throw new Error(
      "JWT_EXPIRES_IN inválido. Use formatos como 30s, 15m, 1h ou 7d.",
    );
  }
  return value as SignOptions["expiresIn"];
}

const jwtExpiresIn = getJwtExpiresIn();

export const config = {
  port: Number(process.env.PORT) || 3000,
  host: process.env.HOST || "localhost",
  database: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3050,
    database: process.env.DB_DATABASE || ".\\database\\DADOS_ESPANGLISH.FDB",
    user: process.env.DB_USER || "SYSDBA",
    password: process.env.DB_PASSWORD,
    role: process.env.DB_ROLE || "RDB$ADMIN",
  },
  jwt: {
    secret: jwtSecret,
    expires: jwtExpiresIn,
  },
};
