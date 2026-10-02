import { NextFunction, Request, Response } from "express";
import { AppError } from "../libs/error.lib";
import jwt from "jsonwebtoken";
import {
  AuthJWtPayload,
  JwtPayloadSchema,
} from "@greenhouse/schemas/jwt.schema";

declare global {
  namespace Express {
    interface Request {
      user?: AuthJWtPayload;
    }
  }
}

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    let token: string | undefined = req.cookies?.token;
    const authHeader = req.headers.authorization;

    if (!token && authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      throw new AppError(
        "Unauthorized: Token autentikasi tidak ditemukan",
        401,
      );
    }

    // const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new AppError(
        "Internal Server Error: JWT_SECRET belum dikonfigurasi",
        500,
      );
    }

    const decoded = jwt.verify(token, secret);

    const parsedPayload = JwtPayloadSchema.safeParse(decoded);

    if (!parsedPayload.success) {
      throw new AppError("Unauthorized: Struktur token tidak dikenali", 401);
    }

    req.user = parsedPayload.data;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError("Unauthorized: Token sudah kedaluwarsa", 401));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Unauthorized: Token tidak valid", 401));
    }

    next(error);
  }
};
