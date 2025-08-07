import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "../middleware/errorHandler.js";

export async function handlerNewUser(req:Request, res: Response) {
    type parameters = {
        email: string
    };

    const params: parameters = req.body;
    const email = params.email;

    if (email === undefined) {
        throw new BadRequestError("No email parameter in the request body");
    }

    try {
        const newUser = await createUser({
            email: email
        });

        const resBody = JSON.stringify(newUser);
        res.status(201).send(resBody);
        res.end();

    } catch (err) {
        throw new Error("Error creating a new user.")
    }


}