import express from "express";
import { handlerReadiness } from "./handlers/handlerReadiness.js";
import { middlewareLogResponses } from "./middleware/middlewareLogResponses.js";
import { middlewareMetricsInc } from "./middleware/middlewareMetricsInc.js";
import { handlerMetrics } from "./handlers/handlerMetrics.js";
import { handlerReset } from "./handlers/handlerReset.js";

const app = express();
const PORT = 8080;

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponses);

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.get("/admin/reset", handlerReset);


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});