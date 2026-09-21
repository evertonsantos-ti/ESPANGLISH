import * as logger from "./utils/logger";
import "dotenv/config";
import app from "./app";
import { config } from "./controllers/config";
import { testConnection } from "./database/connection";

async function startServer() {
  try {
    logger.info(
      "#-------------- Teste de conexão com o banco de dados --------------#\n",
    );
    await testConnection();
    logger.info(`> Conexão com FireBird Estabelecida.\n`);

    logger.info(`#-------------- Iniciando Servidor --------------#\n`);
    app.listen(config.port, () => {
      logger.info(`> Servidor iniciado:`);
      logger.info(`> http://${config.host}:${config.port}/api/`);
    });
  } catch (error) {
    logger.error("Erro ao conectar com o banco de dados:" + error);
    logger.error(`${error}`);
    process.exit(1);
  }
}

startServer();
