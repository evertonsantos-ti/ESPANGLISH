import express from "express";
import router from "./routes/index";
import authRouters from "./routes/auth.routes";
import { errorMiddleware } from "./middlewares/error.middlewares";
import { authenticate } from "./auth/auth.middleware";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());

// Rotas
app.use("/api", router);
app.use("/api/auth", authRouters);
// Mantém compatibilidade com clientes que usavam as rotas de autenticação sem /api.
app.use("/auth", authRouters);

// Middlewares
app.use(authenticate);
app.use(errorMiddleware);

export default app;
