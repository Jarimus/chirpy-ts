import { NextFunction, Request, Response } from "express";
import { respondWithError } from "../handlers/utils.js";


// Error 400
export class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
    }
}

// Error 401
export class UnauthorizedError extends Error {
    constructor(message: string) {
        super(message)
    }
}

// Error 403
export class ForbiddenError extends Error {
    constructor(message: string) {
        super(message)
    }
}

// Error 404
export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const msg = err.message
    console.log(`[NON-OK] Error: ${msg}`)

    // Find the correct error code based on the error class
    if (err instanceof BadRequestError) {
        return respondWithError(res, 400, msg);
    }
    if (err instanceof UnauthorizedError) {
        return respondWithError(res, 401, msg);
    }
    if (err instanceof ForbiddenError) {
        return respondWithError(res, 403, msg);
    }
    if (err instanceof NotFoundError) {
        return respondWithError(res, 404, msg);
    }

    respondWithError(res, 500, msg)
}