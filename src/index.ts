import express from "express";
import { handlerReadiness } from "./handlers/handlerReadiness.js";
import { middlewareLogResponses } from "./middleware/middlewareLogResponses.js";

const app = express();
const PORT = 8080;

app.use("/app", express.static("./src/app"));
app.use(middlewareLogResponses);

app.get("/healthz", handlerReadiness);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});