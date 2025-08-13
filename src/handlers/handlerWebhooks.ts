import { Request, Response } from "express";
import { respondWithJSON } from "./utils.js";
import { updateChirpyRed } from "../db/queries/users.js";
import { NotFoundError } from "../middleware/errorHandler.js";

export async function handlerWebhooks(req:Request, res: Response) {
    type parameters = {
        event: string,
        data: {
            userId: string
        }
    };

    const params: parameters = req.body;

    if (params.event != "user.upgraded") {
        respondWithJSON(res, 204, "");
        return
    }

    const userID = params.data.userId;

    const user = await updateChirpyRed(userID, true);

    if (user === undefined) {
        throw new NotFoundError("user not found");
    }

    respondWithJSON(res, 204, "");
    return
}