import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "../middleware/errorHandler.js";
import { respondWithJSON } from "./utils.js";
import { hashPassword } from "../auth/password.js";

export async function handlerCreateUser(req:Request, res: Response) {
    type parameters = {
        email: string
        password: string
    };

    const params: parameters = req.body;
    const email = params.email;
    const password = params.password

    if (email === undefined || password === undefined) {
        throw new BadRequestError("Insufficient parameters");
    }

    try {
        const newUser = await createUser({
            email: email,
            hashedPassword: await hashPassword(password)
        });

        respondWithJSON(res, 201, {
            id: newUser.id,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
            email: newUser.email
        })

    } catch (err) {
        throw new Error("Error creating a new user.")
    }


}