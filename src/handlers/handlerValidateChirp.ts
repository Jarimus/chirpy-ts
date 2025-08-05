import { Request, Response } from "express";
import { stringify } from "querystring";

export async function handlerValidateChirp(req:Request, res: Response) {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    })

    req.on("end", () => {
        try {
            type reqBody = {
                body: String
            }
            const parsedBody: reqBody = JSON.parse(body);
            const chirp = parsedBody.body;

            if (chirp.length > 140) {
                type errorResponse = {
                error: String;
            }
            const resBody: errorResponse = {
                error: "Chirp is too long"
            }

            res.header("Content-Type", "application/json");
            const body = JSON.stringify(resBody);
            res.status(400).send(body);
            res.end();
            } else {
                type response = {
                valid: boolean;
            }
            const resBody: response = {
                valid: true
            }

            res.header("Content-Type", "application/json");
            const body = JSON.stringify(resBody) + "\n";
            res.status(200).send(body);
            res.end();
            }

        } catch (error) {            
            type errorResponse = {
                error: String;
            }
            const resBody: errorResponse = {
                error: `Something went wrong: ${error}`
            }

            res.header("Content-Type", "application/json");
            const body = JSON.stringify(resBody) + "\n";
            res.status(400).send(body);
            res.end();
        }
    })
}