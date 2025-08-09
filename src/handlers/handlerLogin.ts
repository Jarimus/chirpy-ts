import { Request, Response } from "express";
import { checkPassword } from "../auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import { BadRequestError, UnauthorizedError } from "../middleware/errorHandler.js";
import { respondWithJSON } from "./utils.js";

export async function handlerLogin(req:Request, res: Response) {
    type parameters = {
        email: string,
        password: string
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

    respondWithJSON(res, 200, {
        id: dbUser.id,
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
        email: dbUser.email,
    })
}