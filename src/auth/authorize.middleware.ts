import { Request, Response, NextFunction } from "express";
import type { AuthUser } from "./auth.types";

export function authorize(...tiposPermitidos: AuthUser["tipo"][]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({
        message: "Usuário não autenticado.",
      });
      return;
    }
    if (!tiposPermitidos.includes(user.tipo)) {
      res.status(403).json({
        message: "Usuário não possui permissão para acessar este recurso.",
      });
      return;
    }
    next();
  };
}
