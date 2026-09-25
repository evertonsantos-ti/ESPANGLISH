import express from "express";
import router from "./routes/index";
import authRouters from "./routes/auth.routes";
import { errorMiddleware } from "./middlewares/error.middlewares";
import { authenticate } from "./auth/auth.middleware";

const app = express();

app.use(express.json());

// Rotas
app.use("/api", router);
app.use("/auth", authRouters);

// Middlewares
app.use(authenticate);
app.use(errorMiddleware);

export default app;
