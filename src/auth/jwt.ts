import * as jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'
import { UnauthorizedError } from 'src/middleware/errorHandler';

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function makeJWT(userID:string, expiresIn:number, secret:string) {
    const iat = Math.floor(Date.now() / 1000);
    const jwtPayload: payload = {
        iss: "chirpy",
        sub: userID,
        iat: iat,
        exp: iat + expiresIn
    }

    const jwtString = jwt.sign(jwtPayload, secret);
    return jwtString;
}

export async function validateJWT(tokenString:string, secret:string) {
    const jwtPayload = jwt.verify(tokenString, secret);

    if (typeof jwtPayload === "string") {
        throw new UnauthorizedError("Invalid JWT");
    }

   const userID = jwtPayload.sub;
   return userID;
}