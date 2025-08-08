import { Request, Response } from "express";
import { getOneChirp } from "../db/queries/chirps.js";
import { NewChirp } from "../db/schema.js";
import { BadRequestError } from "../middleware/errorHandler.js";
import { respondWithJSON } from "./utils.js";

export async function handlerGetOneChirp(req:Request, res:Response) {
    const chirpID = req.params["chirpID"]
    const dbChirp: NewChirp = await getOneChirp(chirpID)

    if (dbChirp === undefined) {
        throw new BadRequestError("No chirp for that chirpID");
    }

    respondWithJSON(res, 200, dbChirp);
}