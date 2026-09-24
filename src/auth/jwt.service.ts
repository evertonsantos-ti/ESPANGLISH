import { config } from "../config";
import Jwt from "jsonwebtoken";

export type JwtPayload =
  | {
      sub: number;
      tipo: "ADMIN";
    }
  | {
      sub: number;
      tipo: "JURADO";
      eventoId: number;
    };

export class JwtService {
  private isJwtPayLoad(payLoad: unknown): payLoad is JwtPayload {
    if (typeof payLoad === "object" && payLoad !== null) {
      const dados = payLoad as Record<string, unknown>;
      if (typeof dados.sub === "number") {
        if (dados.tipo === "ADMIN" || dados.tipo === "JURADO") {
          if (
            dados.tipo === "JURADO" &&
            !(typeof dados.eventoId === "number")
          ) {
            return false;
          }
          return true;
        }
      }
    }
    return false;
  }

  generate(payload: JwtPayload): string {
    const token = Jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expires,
    });

    return token;
  }
  verify(token: string): JwtPayload | null {
    try {
      const payLoad = Jwt.verify(token, config.jwt.secret, {
        algorithms: ["HS256"],
      });
      if (this.isJwtPayLoad(payLoad)) {
        return payLoad.tipo === "ADMIN"
          ? {
              sub: payLoad.sub,
              tipo: payLoad.tipo,
            }
          : {
              sub: payLoad.sub,
              tipo: payLoad.tipo,
              eventoId: payLoad.eventoId,
            };
      }
      return null;
    } catch {
      return null;
    }
  }
}
