import "dotenv/config";

export const config = {
  port: Number(process.env.PORT) || 3000,
  database: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3050,
    database: process.env.DB_DATABASE || ".\\database\\DADOS_ESPANGLISH.FDB",
    user: process.env.DB_USER || "SYSDBA",
    password: process.env.DB_PASSWORD,
    role: process.env.DB_ROLE || "RDB$ADMIN",
  },
};
