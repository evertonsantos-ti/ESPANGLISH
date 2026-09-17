import express from "express";
import router from "./routes";
import { errorMiddleware } from "./middlewares/error.middlewares";

const app = express();

app.use(express.json());
app.use("/api", router);
app.use(errorMiddleware);

export default app;
