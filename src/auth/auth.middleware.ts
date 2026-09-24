import { Request, Response, NextFunction } from "express";
import { JwtService, JwtPayload } from "./jwt.service";
import { AuthUser } from "./auth.types";

function parseUser(payLoad: JwtPayload): AuthUser {
  if (payLoad.tipo === "ADMIN") {
    return {
      id: payLoad.sub,
      tipo: payLoad.tipo,
    };
  }
  return {
    id: payLoad.sub,
    tipo: payLoad.tipo,
    eventoId: payLoad.eventoId,
  };
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const jwtService = new JwtService();
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).json({
      message:
        "Serviço de autenticação não conseguiu encontrar os dados necessários para acesso ao sistema.",
    });

    return;
  }

  const token = authorization.split(" ")[1];
  const payLoad = jwtService.verify(token);

  if (payLoad === null) {
    res.status(401).json({
      message: "Token inválido ou expirado!",
    });
    return;
  }

  req.user = parseUser(payLoad);
  next();
}
