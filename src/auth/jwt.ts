import { Request } from 'express';
import { BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import pkg, { JwtPayload } from 'jsonwebtoken';
const { sign, verify } = pkg;

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function makeJWT(userID:string, secret:string) {
    const iat = Math.floor(Date.now() / 1000);
    const jwtPayload: payload = {
        iss: "chirpy",
        sub: userID,
        iat: iat,
        exp: iat + 3600 // 1 hour
    }

    const jwtString = sign(jwtPayload, secret);
    return jwtString;
}

export async function validateJWT(tokenString:string, secret:string) {
    let jwtPayload;
    try {
        jwtPayload = verify(tokenString, secret);
    } catch (err) {
        throw new UnauthorizedError("jwt malformed");
    }

    if (typeof jwtPayload === "string") {
        throw new UnauthorizedError("Invalid JWT");
    }

   const userID = jwtPayload.sub;
   if (userID === undefined) {
    throw new UnauthorizedError("jwt malformed");
   }
   return userID;
}

export async function getBearerToken(req:Request) {
    const authHeader = req.get('Authorization');
    const parts = authHeader?.split(' ');
    if (parts === undefined || parts.length < 2) {
        throw new UnauthorizedError("bad header: 'Authorization'")
    }
    const tokenString = parts[1].trim();
    return tokenString;
}