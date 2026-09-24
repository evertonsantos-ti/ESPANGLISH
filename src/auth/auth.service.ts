import { AdminLoginInput } from "./auth.types";
import { UsuarioRepository } from "../repositories/usuario.repository";
import { UnauthorizedError } from "../utils/error";
import { PasswordService } from "./password.service";
import { JwtService } from "./jwt.service";

export class AuthService {
  constructor(
    private usuarioRepository: UsuarioRepository,
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

    const tokenGenerated = this.jwtService.generate({
      sub: registro.id,
      tipo: "ADMIN",
    });

    return { token: tokenGenerated };
  }
}
