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

// Eventos ----------------------------------------------------------------------------
// GET
router.get("/eventos", (req, res) => {
  return eventoController.listar(req, res);
});
router.get("/eventos/:id", (req, res) => {
  return eventoController.listar(req, res);
});
// POST
router.post("/eventos", (req, res) => {
  return eventoController.criar(req, res);
});
router.post("/eventos/inativar-eventos-vencidos", (req, res) => {
  return eventoController.inativarEventosVencidos(req, res);
});
// PUT
router.put("/eventos/:id", (req, res) => {
  return eventoController.alterar(req, res);
});
export default router;
