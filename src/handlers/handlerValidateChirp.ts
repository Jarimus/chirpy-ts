import { Request, Response } from "express";
import { respondWithJSON } from "./utils.js";

export async function handlerValidateChirp(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;

  if (params.body.length > 140) {
    throw new Error("Chirp is too long");
  }

  let payload = params.body.replaceAll(/kerfuffle|sharbert|fornax/gi, "****")

  respondWithJSON(res, 200, {
    cleanedBody: payload,
  });
}
