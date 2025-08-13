import { Request, Response } from "express";
import { getChirps, getChirpsByUserId } from "../db/queries/chirps.js";
import { respondWithJSON } from "./utils.js";

export async function handlerGetChirps(req:Request, res: Response) {

    // Check for a query to look for chirps by a specific author
    const authorId = req.query.authorId;
    if (typeof authorId === "string") {
        const chirps = await getChirpsByUserId(authorId);
        if (chirps.length === 0) {
            respondWithJSON(res, 200, { body: "No chirps."});
            return
        }
        respondWithJSON(res, 200, chirps)
    }

    const chirps = await getChirps();

    if (chirps.length === 0) {
        respondWithJSON(res, 200, {
            body: "No chirps."
        })
        return
    }

    respondWithJSON(res, 200, chirps);
}