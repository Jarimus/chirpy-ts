import { Request, Response } from "express";
import { config } from "../config.js";

export async function handlerReset(req: Request, res: Response): Promise<void> {
    config.fileserverHits = 0;
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Server hits reset to zero.</p>
  </body>
</html>`);
}