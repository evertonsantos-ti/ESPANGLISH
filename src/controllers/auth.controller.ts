import { AuthService } from "../auth/auth.service";
import { Request, Response } from "express";
import { AdminValidator } from "../utils/validators/login.validator";

export class AuthController {
  constructor(private authService: AuthService) {}

  async loginAdmin(req: Request, res: Response): Promise<void> {
    const input = AdminValidator(req.body);

    const resultado = await this.authService.loginAdmin(input);
    res.status(200).json(resultado);
  }
}
