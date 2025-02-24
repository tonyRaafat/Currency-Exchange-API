import { compare, hash } from 'bcrypt';

export class HashUtil {
  static async hashPassword(password: string, salt: number): Promise<string> {
    return await hash(password, salt);
  }

  static async comparePassword(
    password: string,
    encryptedPassword: string,
  ): Promise<boolean> {
    return await compare(password, encryptedPassword);
  }
}
