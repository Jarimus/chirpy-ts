import { Request, Response } from "express";
import { getBearerToken } from "../auth/jwt.js";
import { revokeToken } from "../db/queries/refreshTokens.js";

export async function handlerRevoke(req:Request, res:Response) {
    const refreshTokenString = await getBearerToken(req);
    await revokeToken(refreshTokenString);
    res.status(204);
    res.end();
}