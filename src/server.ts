import "dotenv/config";
import app from "./app";
import { config } from "./config";
import { testConnection } from "./database/connection";

async function startServer() {
  try {
    await testConnection();
    console.log("Conexão com FireBird Estabelecida.");

    app.listen(config.port, () => {
      console.log(`Servidor rodando na porta ${config.port}`);
    });
  } catch (error) {
    console.error("Erro ao conectar com o banco de dados:", error);
    console.error(error);
    process.exit(1);
  }
}

startServer();
