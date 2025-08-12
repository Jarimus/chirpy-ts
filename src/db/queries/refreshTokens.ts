import { eq } from "drizzle-orm";
import { db } from "../index.js"
import { NewRefreshToken, refreshTokens } from "../schema.js"

export async function createRefreshToken(refreshToken: NewRefreshToken) {
    const [result] = await db
    .insert(refreshTokens)
    .values(refreshToken)
    .onConflictDoNothing()
    .returning();
    return result;
}

export async function getRefreshToken(refreshTokenString:string) {
  const [result] = await db
  .select()
  .from(refreshTokens)
  .where(eq(refreshTokens.token, refreshTokenString))
  .limit(1);

  return result;
}

export async function revokeToken(refreshTokenString:string) {
  const [result] = await db
  .update(refreshTokens)
  .set({revokedAt: new Date()})
  .where(eq(refreshTokens.token, refreshTokenString))
  .returning();
}