import { Router } from "express";
import * as container from "../container/index";
import { authenticate } from "../auth/auth.middleware";
import { authorize } from "../auth/authorize.middleware";

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
// POST (ADMIN)
router.post("/eventos", authenticate, authorize("ADMIN"), (req, res) => {
  return container.eventoController.criar(req, res);
});
router.post(
  "/eventos/inativar-eventos-vencidos",
  authenticate,
  authorize("ADMIN"),
  (req, res) => {
    return container.eventoController.inativarEventosVencidos(req, res);
  },
);
// PUT (ADMIN)
router.put("/eventos/:id", authenticate, authorize("ADMIN"), (req, res) => {
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
// POST (ADMIN)
router.post("/equipes", authenticate, authorize("ADMIN"), (req, res) => {
  return container.equipeController.criar(req, res);
});
// PUT (ADMIN)
router.put("/equipes/:id", authenticate, authorize("ADMIN"), (req, res) => {
  return container.equipeController.alterar(req, res);
});

// CATEGORIAS ----------------------------------------------------------------------------
// GET
router.get(
  "/categorias",
  authenticate,
  authorize("ADMIN", "JURADO"),
  (req, res) => {
    return container.categoriaController.listar(req, res);
  },
);
router.get("/categorias/:id", (req, res) => {
  return container.categoriaController.listar(req, res);
});
// POST (ADMIN)
router.post("/categorias", authenticate, authorize("ADMIN"), (req, res) => {
  return container.categoriaController.criar(req, res);
});
// PUT (ADMIN)
router.put("/categorias/:id", authenticate, authorize("ADMIN"), (req, res) => {
  return container.categoriaController.alterar(req, res);
});

// CRITERIOS ----------------------------------------------------------------------------
// GET
router.get(
  "/criterios",
  authenticate,
  authorize("ADMIN", "JURADO"),
  (req, res) => {
    return container.criterioController.listar(req, res);
  },
);
router.get(
  "/criterios/:id",
  authenticate,
  authorize("ADMIN", "JURADO"),
  (req, res) => {
    return container.criterioController.listar(req, res);
  },
);
// POST (ADMIN)
router.post("/criterios", authenticate, authorize("ADMIN"), (req, res) => {
  return container.criterioController.criar(req, res);
});
// PUT (ADMIN)
router.put("/criterios/:id", authenticate, authorize("ADMIN"), (req, res) => {
  return container.criterioController.alterar(req, res);
});

// JURADOS ----------------------------------------------------------------------------
// GET (ADMIN)
router.get("/jurados", authenticate, authorize("ADMIN"), (req, res) => {
  return container.juradoController.listar(req, res);
});
router.get("/jurados/:id", authenticate, authorize("ADMIN"), (req, res) => {
  return container.juradoController.listar(req, res);
});
// POST (ADMIN)
router.post("/jurados", authenticate, authorize("ADMIN"), (req, res) => {
  return container.juradoController.criar(req, res);
});
// PUT (ADMIN)
router.put("/jurados/:id", authenticate, authorize("ADMIN"), (req, res) => {
  return container.juradoController.alterar(req, res);
});

// USUARIOS ----------------------------------------------------------------------------
// GET (ADMIN)
router.get("/usuarios", authenticate, authorize("ADMIN"), (req, res) => {
  return container.usuarioController.listar(req, res);
});
router.get("/usuarios/:id", authenticate, authorize("ADMIN"), (req, res) => {
  return container.usuarioController.listar(req, res);
});
// POST (ADMIN)
router.post("/usuarios", authenticate, authorize("ADMIN"), (req, res) => {
  return container.usuarioController.criar(req, res);
});
// PUT (ADMIN)
router.put("/usuarios/:id", authenticate, authorize("ADMIN"), (req, res) => {
  return container.usuarioController.alterar(req, res);
});
// DELETE (ADMIN)
router.delete("/usuarios/:id", authenticate, authorize("ADMIN"), (req, res) => {
  return container.usuarioController.deletar(req, res);
});

// JURADO_CATEGORIA ----------------------------------------------------------------------------
// GET (ADMIN)
router.get(
  "/jurado-categorias",
  authenticate,
  authorize("ADMIN"),
  (req, res) => {
    return container.juradoCategoriaController.listar(req, res);
  },
);
router.get(
  "/jurado-categorias/:id",
  authenticate,
  authorize("ADMIN"),
  (req, res) => {
    return container.juradoCategoriaController.listar(req, res);
  },
);
// POST (ADMIN)
router.post(
  "/jurado-categorias",
  authenticate,
  authorize("ADMIN"),
  (req, res) => {
    return container.juradoCategoriaController.criar(req, res);
  },
);

// AVALIACOES ----------------------------------------------------------------------------
// GET (ADMIN)
router.get(
  "/avaliacoes",
  authenticate,
  authorize("ADMIN", "JURADO"),
  (req, res) => {
    return container.avaliacaoController.listar(req, res);
  },
);
router.get("/avaliacoes/:id", authenticate, authorize("ADMIN"), (req, res) => {
  return container.avaliacaoController.listar(req, res);
});
// POST (ADMIN)
router.post("/avaliacoes", authenticate, authorize("ADMIN"), (req, res) => {
  return container.avaliacaoController.criar(req, res);
});

// NOTAS ----------------------------------------------------------------------------
// GET (ADMIN)
router.get("/notas", authenticate, authorize("ADMIN", "JURADO"), (req, res) => {
  return container.notaController.listar(req, res);
});
router.get(
  "/notas/:id",
  authenticate,
  authorize("ADMIN", "JURADO"),
  (req, res) => {
    return container.notaController.listar(req, res);
  },
);
// POST (JURADO)
router.post("/notas", authenticate, authorize("JURADO"), (req, res) => {
  return container.notaController.criar(req, res);
});
// PUT (ADMIN)
router.put(
  "/notas/:id",
  authenticate,
  authorize("ADMIN", "JURADO"),
  (req, res) => {
    return container.notaController.alterar(req, res);
  },
);

// MOVIMENTACOES PONTUACAO ----------------------------------------------------------------------------
// GET (ADMIN)
router.get(
  "/movimentacoes-pontuacao",
  authenticate,
  authorize("ADMIN"),
  (req, res) => {
    return container.movimentacaoPontuacaoController.listar(req, res);
  },
);
router.get(
  "/movimentacoes-pontuacao/:id",
  authenticate,
  authorize("ADMIN"),
  (req, res) => {
    return container.movimentacaoPontuacaoController.listar(req, res);
  },
);
// POST (ADMIN)
router.post(
  "/movimentacoes-pontuacao",
  authenticate,
  authorize("ADMIN"),
  (req, res) => {
    return container.movimentacaoPontuacaoController.criar(req, res);
  },
);
export default router;
