import { Request, Response } from "express";
import { checkPassword } from "../auth/password.js";
import { getUserByEmail } from "../db/queries/users.js";
import { BadRequestError, UnauthorizedError } from "../middleware/errorHandler.js";
import { respondWithJSON } from "./utils.js";
import { makeJWT } from "../auth/jwt.js";
import { config } from "../config.js";
import { makeRefreshToken } from "../auth/refreshTokens.js";
import { NewRefreshToken } from "../db/schema.js";
import { createRefreshToken } from "../db/queries/refreshTokens.js";

export async function handlerLogin(req:Request, res: Response) {
    type parameters = {
        email: string,
        password: string,
    }
    const params: parameters = req.body;
    const email = params.email;
    const password = params.password;

    if (email === undefined || password === undefined) {
        throw new BadRequestError("Insufficient parameters");
    }

    const dbUser = await getUserByEmail(email);

    if (dbUser === undefined) {
        throw new UnauthorizedError("Incorrect email or password")
    }

    const isAuthorized = await checkPassword(password, dbUser.hashedPassword);

    if (!isAuthorized) {
        throw new UnauthorizedError("Incorrect email or password");
    }

    const jwtToken = await makeJWT(dbUser.id, config.api.secret)

    const refreshTokenString = await makeRefreshToken();
    const refreshTokenExp = new Date( Date.now() + 60*60*24*60*1000 ) // Should expire in 60 days

    const refreshTokenParams: NewRefreshToken = {
        userId: dbUser.id,
        token: refreshTokenString,
        expiresAt: refreshTokenExp
    }

    const dbRefreshToken = await createRefreshToken(refreshTokenParams);

    respondWithJSON(res, 200, {
        id: dbUser.id,
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
        email: dbUser.email,
        token: jwtToken,
        refreshToken: dbRefreshToken.token,
    })
}