import { Router } from "express";
import { authController } from "../container";

const router = Router();

router.post("/admin/login", (req, res, next) => {
  authController.loginAdmin(req, res).catch(next);
});

export default router;
