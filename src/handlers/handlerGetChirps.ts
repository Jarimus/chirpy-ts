import { Request, Response } from "express";
import { getChirps, getChirpsByUserId } from "../db/queries/chirps.js";
import { respondWithJSON } from "./utils.js";

export async function handlerGetChirps(req:Request, res: Response) {

    // Get sorting style from query parameter
    let sort = "asc";
    const sortQuery = req.query.sort;
    if (sortQuery === "desc") {
        sort = sortQuery
    }

    // Check for a query to look for chirps by a specific author
    const authorId = req.query.authorId;
    if (typeof authorId === "string") {
        const chirps = await getChirpsByUserId(authorId);
        if (chirps.length === 0) {
            respondWithJSON(res, 200, { body: "No chirps."});
            return
        }
        if (sort === "desc") {
            chirps.sort((a, b) => {
                return b.createdAt.getTime() - a.createdAt.getTime()
            })
        }
        respondWithJSON(res, 200, chirps)
        return
    }

    const chirps = await getChirps();

    if (sort === "desc") {
        chirps.sort((a, b) => {
            return b.createdAt.getTime() - a.createdAt.getTime()
        })
    }

    if (chirps.length === 0) {
        respondWithJSON(res, 200, {
            body: "No chirps."
        })
        return
    }

    respondWithJSON(res, 200, chirps);
}