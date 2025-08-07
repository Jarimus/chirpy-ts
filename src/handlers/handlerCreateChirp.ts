import { Request, Response } from "express";
import { respondWithJSON } from "./utils.js";
import { BadRequestError } from "../middleware/errorHandler.js";
import { createChirp } from "../db/queries/chirps.js";

export async function handlerCreateChirp(req: Request, res: Response) {
  type parameters = {
    body: string;
    userId: string;
  };

  const params: parameters = req.body;

  if (params.body.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140")
  }

  if (params.userId === undefined) {
    throw new BadRequestError("userId undefined");
  }

  let payload = params.body.replaceAll(/kerfuffle|sharbert|fornax/gi, "****")

  const chirp = await createChirp({
    body: payload,
    userId: params.userId
  })

  respondWithJSON(res, 201, {
    cleanedBody: chirp,
  });
}
