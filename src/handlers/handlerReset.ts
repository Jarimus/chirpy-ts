import { Request, Response } from "express";
import { config } from "../config.js";
import { deleteUsers } from "../db/queries/users.js";

export async function handlerReset(req: Request, res: Response): Promise<void> {

  if (config.api.platform != "dev") {
    res.status(403).send("403: Forbidden");
    res.end();
    return
  }

  // Reset server hit count  
  config.api.fileserverHits = 0;

  // Delete all users
  try {
    await deleteUsers()
  } catch (err) {
    throw new Error("Error resetting users")
  }

  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send(`<html>
<body>
  <h1>Welcome, Chirpy Admin</h1>
  <p>Server hits reset to zero.</p>
  <p>All users deleted.</p>
</body>
</html>`);
}