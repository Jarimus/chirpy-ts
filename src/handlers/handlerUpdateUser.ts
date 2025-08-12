import { Request, Response } from "express";
import { getBearerToken, validateJWT } from "../auth/jwt.js";
import { hashPassword } from "../auth/password.js";
import { config } from "../config.js";
import { BadRequestError } from "../middleware/errorHandler.js";
import { updateUserPasswordEmail } from "../db/queries/users.js";
import { respondWithJSON } from "./utils.js";

export async function handlerUpdateUser(req:Request, res: Response) {
    type parameters = {
        password: string,
        email: string
    }
    const params: parameters = req.body;
    const password = params.password;
    const email = params.email;
    const accessToken = await getBearerToken(req);
    if (email === undefined || password === undefined) {
        throw new BadRequestError("Insufficient parameters")
    }

    const userID = await validateJWT(accessToken, config.api.secret);
    const hashedPassword = await hashPassword(password);
    const dbUser = await updateUserPasswordEmail(userID, hashedPassword, email);
    
    respondWithJSON(res, 200, {
        id: dbUser.id,
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
        email: dbUser.email,
    })
}