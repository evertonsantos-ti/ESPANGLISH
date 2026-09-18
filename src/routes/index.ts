import { Router } from "express";
import * as container from "../container/index";

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
  return container.eventoController.listar(req, res);
});
router.get("/eventos/:id", (req, res) => {
  return container.eventoController.listar(req, res);
});
// POST
router.post("/eventos", (req, res) => {
  return container.eventoController.criar(req, res);
});
router.post("/eventos/inativar-eventos-vencidos", (req, res) => {
  return container.eventoController.inativarEventosVencidos(req, res);
});
// PUT
router.put("/eventos/:id", (req, res) => {
  return container.eventoController.alterar(req, res);
});
export default router;
