import { NextFunction, Request, Response } from "express";
import { AppError } from "../libs/error.lib";
import jwt from "jsonwebtoken";
import { AppJwtPayload } from "../types/jwt.type";

declare global {
  namespace Express {
    interface Request {
      user?: AppJwtPayload;
    }
  }
}

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(
        "Unauthorized: Token autentikasi tidak ditemukan",
        401,
      );
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new AppError(
        "Internal Server Error: JWT_SECRET belum dikonfigurasi",
        500,
      );
    }

    const decoded = jwt.verify(token, secret) as AppJwtPayload;
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError("Unauthorized: Token sudah kedaluwarsa", 401));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Unauthorized: Token tidak valid", 401));
    }

    next();
  }
};
