import { NextFunction, Request, Response } from "express";
import { respondWithError } from "../handlers/utils.js";

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const msg = "Something went wrong on our end"
    console.log(msg)
    respondWithError(res, 500, msg)
}