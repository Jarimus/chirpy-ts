import { Request, Response } from "express";
import { respondWithJSON, respondWithError } from "./utils.js";

export async function handlerValidateChirp(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;

  if (params.body.length > 140) {
    respondWithError(res, 400, "Chirp is too long");
    return;
  }

  let payload = params.body.replaceAll(/kerfuffle|sharbert|fornax/gi, "****")

  respondWithJSON(res, 200, {
    cleanedBody: payload,
  });
}
