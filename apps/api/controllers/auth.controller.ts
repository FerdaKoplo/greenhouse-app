import { LoginSchema } from "@greenhouse/schemas";
import { IAuthService } from "../services/dependencies/auth.dependency";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../libs/error.lib";
import { ApiResponse } from "../libs/apiResponse.lib";
import { catchAsync } from "../libs/catchAsync.lib";

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  public login = catchAsync(async (req: Request, res: Response) => {
    const parsedBody = LoginSchema.safeParse(req.body);

    if (!parsedBody.success) {
      throw new AppError("Format input tidak valid", 400);
    }

    const { name, password } = parsedBody.data;

    const result = await this.authService.login(name, password);

    return ApiResponse.success(res, 200, "Login berhasil", result);
  });
}
