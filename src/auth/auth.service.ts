import { AdminLoginInput, JuradoLoginInput } from "./auth.types";
import { UsuarioRepository } from "../repositories/usuario.repository";
import { JuradoRepository } from "../repositories/jurado.repository";
import { UnauthorizedError } from "../utils/error";
import { PasswordService } from "./password.service";
import { JwtService } from "./jwt.service";

export class AuthService {
  constructor(
    private usuarioRepository: UsuarioRepository,
    private juradoRepository: JuradoRepository,
    private passwordService: PasswordService,
    private jwtService: JwtService,
  ) {}
  async loginAdmin(input: AdminLoginInput): Promise<{ token: string }> {
    const registro = await this.usuarioRepository.buscarPorNome(input.nome);

    if (registro === null) {
      throw new UnauthorizedError("Credenciais inválidas.");
    }

    if (
      !(await this.passwordService.compare(input.senha, registro.senhaHash))
    ) {
      throw new UnauthorizedError("Credenciais inválidas.");
    }

    const token = this.jwtService.generate({
      sub: registro.id,
      tipo: "ADMIN",
    });

    return { token };
  }

  async loginJurado(input: JuradoLoginInput): Promise<{ token: string }> {
    const registro = await this.juradoRepository.buscarParaLogin(
      input.login,
      input.eventoId,
    );

    if (registro === null) {
      throw new UnauthorizedError("Credenciais inválidas.");
    }
    if (!(input.senha === String(registro.id))) {
      throw new UnauthorizedError("Credenciais inválidas.");
    }

    const token = this.jwtService.generate({
      sub: registro.id,
      tipo: "JURADO",
      eventoId: registro.idEvento,
    });

    return { token };
  }
}
