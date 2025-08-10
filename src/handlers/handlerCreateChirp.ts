import { Request, Response } from "express";
import { respondWithJSON } from "./utils.js";
import { BadRequestError, UnauthorizedError } from "../middleware/errorHandler.js";
import { createChirp } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth/jwt.js";
import { config } from "../config.js";

export async function handlerCreateChirp(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;

  if (params.body.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140")
  }

  // Check JWTtoken
  const token = await getBearerToken(req);
  const userID = await validateJWT(token, config.api.secret)

  if (userID === undefined) {
    throw new UnauthorizedError("invalid token");
  }

  let payload = params.body.replaceAll(/kerfuffle|sharbert|fornax/gi, "****")

  const chirp = await createChirp({
    body: payload,
    userId: userID
  })

  respondWithJSON(res, 201, chirp);
}
