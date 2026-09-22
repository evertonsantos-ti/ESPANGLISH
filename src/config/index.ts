import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET não configurado!");
}

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
    expires: process.env.JWT_EXPIRES_IN ?? "4h",
  },
};
