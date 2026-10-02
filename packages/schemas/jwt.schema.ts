import z from "zod";

export const JwtPayloadSchema = z.object({
  userId: z.number(),
  role: z.enum(["ADMIN", "OPERATOR"]),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type AuthJWtPayload = z.infer<typeof JwtPayloadSchema>;
