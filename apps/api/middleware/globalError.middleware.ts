import { NextFunction, Response, Request } from "express";
import { AppError } from "../libs/error.lib";

export const globalError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "Error",
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "Error",
    message: "Terjadi kesalahan internal pada server",
  });
};
