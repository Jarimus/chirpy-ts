import express from "express";
import { handlerReadiness } from "./handlers/handlerReadiness.js";
import { middlewareLogResponses } from "./middleware/middlewareLogResponses.js";
import { middlewareMetricsInc } from "./middleware/middlewareMetricsInc.js";
import { handlerMetrics } from "./handlers/handlerMetrics.js";
import { handlerReset } from "./handlers/handlerReset.js";
import { handlerValidateChirp } from "./handlers/handlerValidateChirp.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", async (req, res, next) => {
  try {
    await handlerReadiness(req, res);
  } catch (err) {
    next(err);
  }
});
app.get("/admin/metrics", async (req, res, next) => {
  try {
    await handlerMetrics(req, res);
  } catch (err) {
    next(err);
  }
});
app.post("/admin/reset", async (req, res, next) => {
  try {
    await handlerReset(req, res);
  } catch (err) {
    next(err);
  }
});
app.post("/api/validate_chirp", async (req, res, next) => {
  try {
    await handlerValidateChirp(req, res);
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});