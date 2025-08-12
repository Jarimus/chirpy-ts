import { Request, Response } from "express";
import { getBearerToken, validateJWT } from "../auth/jwt.js";
import { config } from "../config.js";
import { deleteChirp, getOneChirp } from "../db/queries/chirps.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "../middleware/errorHandler.js";

export async function handlerDeleteChirp(req:Request, res: Response) {
    const chirpID = req.params['chirpID'];
    const chirp = await getOneChirp(chirpID);
    const token = await getBearerToken(req);
    const userID = await validateJWT(token, config.api.secret);

    if (chirp === undefined) {
        throw new NotFoundError("chirp not found");
    }

    if (chirp.userId != userID) {
        throw new ForbiddenError("userID mismatch");
    }

    deleteChirp(chirpID);

    res.status(204);
    res.end();
}