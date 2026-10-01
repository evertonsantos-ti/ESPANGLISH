import { UsuarioRepository } from "../repositories/usuario.repository";
import { Usuario, CriarUsuario, AtualizarUsuario } from "../types/usuario";
import { NotFoundError } from "../utils/error";
import { PasswordService } from "../auth/password.service";

export class UsuarioService {
  constructor(
    private readonly repository: UsuarioRepository,
    private readonly passwordService = new PasswordService(),
  ) {}

  async listar(): Promise<Usuario[]> {
    return this.repository.listar();
  }

  async buscarPorId(id: number): Promise<Usuario | null> {
    return this.repository.buscarPorId(id);
  }

  async criar(dados: CriarUsuario): Promise<Usuario> {
    return this.repository.criar({
      nome: dados.nome,
      senhaHash: await this.passwordService.hash(dados.senha),
    });
  }

  async alterar(id: number, dados: AtualizarUsuario): Promise<Usuario | null> {
    const usuario = await this.repository.alterar(id, {
      nome: dados.nome,
      ...(dados.senha
        ? { senhaHash: await this.passwordService.hash(dados.senha) }
        : {}),
    });
    if (!usuario) throw new NotFoundError("Não há usuário com este (ID)!");
    return usuario;
  }

  async deletar(id: number): Promise<void> {
    const user = await this.repository.buscarPorId(id);
    if (!user) throw new NotFoundError("Não há usuário com este (ID)!");
    await this.repository.deletar(id);
  }
}
