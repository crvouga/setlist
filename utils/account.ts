import { v4 } from "uuid";
import { z } from "zod";
import bcrypt from "bcrypt";
import { Err, Ok, Result } from "./result";

export const Password = z.string().min(3);
export type Password = z.infer<typeof Password>;

export const Email = z.string().email();
export type Email = z.infer<typeof Email>;

export const Account = z.object({
  id: z.string().uuid(),
  email: Email,
  passwordHash: z.string(),
});
export type Account = z.infer<typeof Account>;

export const generateAccountId = (): string => {
  return v4();
};

const saltRounds = 10;

export const hashPassword = async (
  password: string
): Promise<Result<string, string>> => {
  try {
    const hashed = await bcrypt.hash(password, saltRounds);
    return Ok(hashed);
  } catch (error) {
    return Err(`Failed to hash password. ${String(error)}`);
  }
};
