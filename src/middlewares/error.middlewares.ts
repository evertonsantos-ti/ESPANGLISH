import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../utils/error";
import * as logger from "../utils/logger";

export function errorMiddleware(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof ValidationError) {
    return res.status(400).json({ error: error.message });
  }

  logger.error(`${error}`);
  return res.status(500).json({ error: "Error interno no servidor" });
}
