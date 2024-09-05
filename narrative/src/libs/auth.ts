import { compare } from "bcryptjs";

export async function verifyPassword(plainTextPassword: string, hashedPassword: string) {
    return await compare(plainTextPassword, hashedPassword);
}
