import { UsuarioRepository } from "../../src/repositories/usuario.repository";
import { PasswordService } from "../../src/auth/password.service";

async function main() {
  const usuarioRepository = new UsuarioRepository();
  const passwordService = new PasswordService();

  const senhaHash = await passwordService.hash("123456");

  await usuarioRepository.criar({
    nome: "admin",
    senhaHash,
  });

  console.log("Usuário admin criado com sucesso!");
}

main().catch((erro) => {
  console.error("Erro ao criar usuário:", erro);
  process.exit(1);
});
