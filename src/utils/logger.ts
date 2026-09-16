import os from "os";

type Nivel = "INFO" | "WARN" | "ERROR";

const usuario = os.userInfo().username;
const cores: Record<Nivel, string> = {
  INFO: "\x1b[36m", // Ciano
  WARN: "\x1b[33m", // Amarelo
  ERROR: "\x1b[35m", // Vermelho
};
const userCor = "\x1b[32m"; // Verde
const resetCor = "\x1b[0m"; // Resetar cor

function prefixo(nivel: Nivel): string {
  return `${userCor}[${usuario} - ${new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  })}] ${cores[nivel]}[${nivel}]${resetCor}`;
}

function info(mensagem: string): void {
  console.log(`${prefixo("INFO")} ${mensagem}`);
}

function warn(mensagem: string): void {
  console.warn(`${prefixo("WARN")} ${mensagem}`);
}

function error(mensagem: string): void {
  console.error(`${prefixo("ERROR")} ${mensagem}`);
}

export { info, warn, error };
