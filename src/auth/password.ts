import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // You can adjust the salt rounds for security vs performance trade-off
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function checkPassword(inputPassWord:string, hashedPassword: string) {
    return await bcrypt.compare(inputPassWord, hashedPassword);
}