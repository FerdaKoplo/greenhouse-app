import jwt from "jsonwebtoken";

export interface AppJwtPayload extends jwt.JwtPayload {
  userId: number;
  role: "ADMIN" | "OPERATOR";
}
