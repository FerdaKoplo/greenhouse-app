import { Response } from "express";

export const ApiResponse = {
  success: (res: Response, statusCode: number, message: string, data?: any) => {
    return res.status(statusCode).json({ status: "Success", message, data });
  },

  error: (res: Response, statusCode: number, message: string, errors?: any) => {
    return res.status(statusCode).json({ status: "Error", message, errors });
  },
};
