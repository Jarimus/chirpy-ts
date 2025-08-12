import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewUser, users } from "../schema.js";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getUserByEmail(email: string) {
  const [result] = await db
  .select()
  .from(users)
  .where(eq(users.email, email));
  return result;
}

export async function deleteUsers() {
  const [result] = await db
  .delete(users)
}

export async function updateUserPasswordEmail(userID: string, hashedPassword:string, email:string) {
  const [result] = await db
  .update(users)
  .set({
    email: email,
    hashedPassword: hashedPassword
  })
  .returning();
  return result;
}