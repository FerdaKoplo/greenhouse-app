import { AuthResponseDTO } from "@greenhouse/schemas";
import { IAuthService } from "../dependencies/auth.dependency";
import { db } from "@greenhouse/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService implements IAuthService {
  async login(name: string, password: string): Promise<AuthResponseDTO> {
    const user = await db.user.findUnique({
      where: { name },
    });

    if (!user) throw new Error("Nama atau password salah");

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new Error("Password salah");

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET belum dikonfigurasi di file .env");
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, secret, {
      expiresIn: "1d",
    });

    const { password: _, ...userResponse } = user;

    return {
      user: userResponse,
      token,
    };
  }
}
