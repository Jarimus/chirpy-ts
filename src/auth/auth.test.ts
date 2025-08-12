import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT } from "./jwt.js";
import { checkPassword, hashPassword } from "./password.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct passwords", async () => {
    const result1 = await checkPassword(password1, hash1);
    const result2 = await checkPassword(password2, hash2)
    expect(result1).toBe(true);
  });

  it("should return false for the incorrect password", async () => {
    const result1 = await checkPassword(password1, hash2);
    const result2 = await checkPassword(password2, hash1);
    expect(result1).toBe(false);
    expect(result2).toBe(false);
  })
});

describe("JWT token creation and validation", () => {
    const userID = "abcdefg1234567";
    const expiresIn = 0.1;
    const secret = "sEcReTsTrInG";

    it("should create and validate a valid JWT token", async () => {
        const jwtString = await makeJWT(userID, secret);
        const decodedUserID = await validateJWT(jwtString, secret);
        expect(decodedUserID).toBe(userID);
    })

    it("should create a JWT token, but validation should fail because of expiration", async () => {
        const jwtString = await makeJWT(userID, secret);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for token to expire
        await expect(validateJWT(jwtString, secret)).rejects.toThrow("jwt expired");
    })

    it("should throw an error for an invalid JWT token", async () => {
        const invalidToken = "invalidTokenString";
        await expect(validateJWT(invalidToken, secret)).rejects.toThrow("jwt malformed");
    })
})