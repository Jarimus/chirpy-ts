import express from "express";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { handlerReadiness } from "./handlers/handlerReadiness.js";
import { middlewareLogResponses } from "./middleware/middlewareLogResponses.js";
import { middlewareMetricsInc } from "./middleware/middlewareMetricsInc.js";
import { handlerMetrics } from "./handlers/handlerMetrics.js";
import { handlerReset } from "./handlers/handlerReset.js";
import { handlerCreateChirp } from "./handlers/handlerCreateChirp.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { handlerCreateUser } from "./handlers/handlerCreateUser.js";

import { config } from "./config.js";
import { handlerGetChirps } from "./handlers/handlerGetChirps.js";
import { handlerGetOneChirp } from "./handlers/handlerGetOneChirp.js";
import { handlerLogin } from "./handlers/handlerLogin.js";
import { handlerRefresh } from "./handlers/handlerRefresh.js";
import { handlerRevoke } from "./handlers/handlerRevoke.js";
import { handlerUpdateUser } from "./handlers/handlerUpdateUser.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migConfig);

const app = express();

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

app.get("/api/chirps", async (req, res, next) => {
  try {
    await handlerGetChirps(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/api/chirps/:chirpID", async (req, res, next) => {
  try {
    await handlerGetOneChirp(req, res);
  } catch (err) {
    next(err);
  }
});

app.post("/api/chirps", async (req, res, next) => {
  try {
    await handlerCreateChirp(req, res);
  } catch (err) {
    next(err);
  }
});

app.post("/api/users", async (req, res, next) => {
  try {
    await handlerCreateUser(req, res);
  } catch (err) {
    next(err);
  }
})

app.put("/api/users", async (req, res, next) => {
  try {
    await handlerUpdateUser(req, res);
  } catch (err) {
    next(err);
  }
})

app.post("/api/login", async (req, res, next) => {
  try {
    await handlerLogin(req, res);
  } catch (err) {
    next(err);
  }
})

app.post("/api/refresh", async (req, res, next) => {
  try {
    await handlerRefresh(req, res);
  } catch (err) {
    next(err);
  }
})

app.post("/api/revoke", async (req, res, next) => {
  try {
    await handlerRevoke(req, res);
  } catch (err) {
    next(err);
  }
})

app.use(errorHandler);

const port = config.api.port
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});