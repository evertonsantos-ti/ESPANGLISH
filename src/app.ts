import express from "express";
import router from "./routes";
import { errorMiddleware } from "./middlewares/error.middlewares";
import { authenticate } from "./auth/auth.middleware";

const app = express();

app.use(express.json());
app.use("/api", router);
app.use(authenticate);
app.use(errorMiddleware);

export default app;
