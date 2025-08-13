import { Request } from "express";
import { UnauthorizedError } from "../middleware/errorHandler.js";

export async function getAPIKey(req:Request) {
    const authHeader = req.get('Authorization');
    const parts = authHeader?.split(' ');
    if (parts === undefined || parts.length < 2) {
        throw new UnauthorizedError("bad header: 'Authorization'")
    }
    const APIKey = parts[1].trim();
    return APIKey;
}