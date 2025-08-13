import { Response, Request } from "express";
import { getBearerToken, makeJWT } from "../auth/jwt.js";
import { getRefreshToken } from "../db/queries/refreshTokens.js";
import { UnauthorizedError } from "../middleware/errorHandler.js";
import { respondWithJSON } from "./utils.js";
import { config } from "../config.js";

export async function handlerRefresh(req: Request, res:Response) {
    const refreshTokenString = await getBearerToken(req);

    const refreshToken = await getRefreshToken(refreshTokenString);

    if (refreshToken === undefined || refreshToken.revokedAt != null) {
        throw new UnauthorizedError("Token invalid");
    }

    if (refreshToken.expiresAt.getTime() < Date.now()) {
        throw new UnauthorizedError("Token expired")
    }
    
    const jwtToken = await makeJWT(refreshToken.userId, config.api.secret);

    respondWithJSON(res, 200, {
        token: jwtToken
    });
}