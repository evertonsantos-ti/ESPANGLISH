import { Router } from "express";
import * as container from "../container/index";
import { AdminLoginInput } from "../auth/auth.types";

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

// Equipes ----------------------------------------------------------------------------
// GET
router.get("/equipes", (req, res) => {
  return container.equipeController.listar(req, res);
});

router.get("/equipes/:id", (req, res) => {
  return container.equipeController.listar(req, res);
});
// POST
router.post("/equipes", (req, res) => {
  return container.equipeController.criar(req, res);
});
// PUT
router.put("/equipes/:id", (req, res) => {
  return container.equipeController.alterar(req, res);
});

// CATEGORIAS ----------------------------------------------------------------------------
// GET
router.get("/categorias", (req, res) => {
  return container.categoriaController.listar(req, res);
});
router.get("/categorias/:id", (req, res) => {
  return container.categoriaController.listar(req, res);
});
// POST
router.post("/categorias", (req, res) => {
  return container.categoriaController.criar(req, res);
});
// PUT
router.put("/categorias/:id", (req, res) => {
  return container.categoriaController.alterar(req, res);
});

// CRITERIOS ----------------------------------------------------------------------------
// GET
router.get("/criterios", (req, res) => {
  return container.criterioController.listar(req, res);
});
router.get("/criterios/:id", (req, res) => {
  return container.criterioController.listar(req, res);
});
// POST
router.post("/criterios", (req, res) => {
  return container.criterioController.criar(req, res);
});
// PUT
router.put("/criterios/:id", (req, res) => {
  return container.criterioController.alterar(req, res);
});

// JURADOS ----------------------------------------------------------------------------
// GET
router.get("/jurados", (req, res) => {
  return container.juradoController.listar(req, res);
});
router.get("/jurados/:id", (req, res) => {
  return container.juradoController.listar(req, res);
});
// POST
router.post("/jurados", (req, res) => {
  return container.juradoController.criar(req, res);
});
// PUT
router.put("/jurados/:id", (req, res) => {
  return container.juradoController.alterar(req, res);
});

// USUARIOS ----------------------------------------------------------------------------
// GET
router.get("/usuarios", (req, res) => {
  return container.usuarioController.listar(req, res);
});
router.get("/usuarios/:id", (req, res) => {
  return container.usuarioController.listar(req, res);
});
// POST
router.post("/usuarios", (req, res) => {
  return container.usuarioController.criar(req, res);
});
// PUT
router.put("/usuarios/:id", (req, res) => {
  return container.usuarioController.alterar(req, res);
});
// DELETE
router.delete("/usuarios/:id", (req, res) => {
  return container.usuarioController.deletar(req, res);
});

// JURADO_CATEGORIA ----------------------------------------------------------------------------
// GET
router.get("/jurado-categorias", (req, res) => {
  return container.juradoCategoriaController.listar(req, res);
});
router.get("/jurado-categorias/:id", (req, res) => {
  return container.juradoCategoriaController.listar(req, res);
});
// POST
router.post("/jurado-categorias", (req, res) => {
  return container.juradoCategoriaController.criar(req, res);
});

// AVALIACOES ----------------------------------------------------------------------------
// GET
router.get("/avaliacoes", (req, res) => {
  return container.avaliacaoController.listar(req, res);
});
router.get("/avaliacoes/:id", (req, res) => {
  return container.avaliacaoController.listar(req, res);
});
// POST
router.post("/avaliacoes", (req, res) => {
  return container.avaliacaoController.criar(req, res);
});

// NOTAS ----------------------------------------------------------------------------
// GET
router.get("/notas", (req, res) => {
  return container.notaController.listar(req, res);
});
router.get("/notas/:id", (req, res) => {
  return container.notaController.listar(req, res);
});
// POST
router.post("/notas", (req, res) => {
  return container.notaController.criar(req, res);
});
// PUT
router.put("/notas/:id", (req, res) => {
  return container.notaController.alterar(req, res);
});

// MOVIMENTACOES PONTUACAO ----------------------------------------------------------------------------
// GET
router.get("/movimentacoes-pontuacao", (req, res) => {
  return container.movimentacaoPontuacaoController.listar(req, res);
});
router.get("/movimentacoes-pontuacao/:id", (req, res) => {
  return container.movimentacaoPontuacaoController.listar(req, res);
});
// POST
router.post("/movimentacoes-pontuacao", (req, res) => {
  return container.movimentacaoPontuacaoController.criar(req, res);
});
export default router;
