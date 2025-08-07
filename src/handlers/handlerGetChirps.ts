import { Request, Response } from "express";
import { getChirps } from "../db/queries/chirps.js";
import { respondWithJSON } from "./utils.js";

export async function handlerGetChirps(req:Request, res: Response) {
    const chirps = await getChirps();

    if (chirps.length === 0) {
        respondWithJSON(res, 200, {
            body: "No chirps."
        })
    }

    respondWithJSON(res, 200, chirps);
}