import { Router } from "express";
import { EventoRepository } from "../repositories/evento.repository";
import { EventoService } from "../services/evento.service";
import { EventoController } from "../controllers/evento.controller";

const eventoRepository = new EventoRepository();
const eventoService = new EventoService(eventoRepository);
const eventoController = new EventoController(eventoService);

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "ESPANGLISH",
  });
});

// Eventos
router.get("/eventos", (req, res) => {
  return eventoController.listar(req, res);
});
router.post("/eventos", (req, res) => {
  return eventoController.criar(req, res);
});
export default router;
