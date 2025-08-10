import { Request, Response } from "express";
import { checkPassword } from "../auth/password.js";
import { getUserByEmail } from "../db/queries/users.js";
import { BadRequestError, UnauthorizedError } from "../middleware/errorHandler.js";
import { respondWithJSON } from "./utils.js";
import { makeJWT } from "../auth/jwt.js";
import { config } from "../config.js";

export async function handlerLogin(req:Request, res: Response) {
    type parameters = {
        email: string,
        password: string,
        expiresInSeconds?: number
    }
    const params: parameters = req.body;
    const email = params.email;
    const password = params.password;
    let expiresInSeconds = 3600
    if (typeof params.expiresInSeconds === "number") {
        expiresInSeconds = Math.min(params.expiresInSeconds, expiresInSeconds);
    }

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

    const JWTtoken = await makeJWT(dbUser.id, expiresInSeconds, config.api.secret)

    respondWithJSON(res, 200, {
        id: dbUser.id,
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
        email: dbUser.email,
        token: JWTtoken,
    })
}