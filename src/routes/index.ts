import { Router } from "express";
import { query } from "../database/query";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "ESPANGLISH",
  });
});

// DATABASE
router.get("/database", async (_req, res) => {
  try {
    const result = await query("SELECT 1 AS TESTE FROM RDB$DATABASE");

    res.json({
      status: "ok",
      service: "ESPANGLISH",
      database: result[0],
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      service: "ESPANGLISH",
      database: "not connected",
    });
  }
});

export default router;
