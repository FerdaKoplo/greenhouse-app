import { z } from "zod";

export const UserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Nama tidak boleh kosong"),
  email: z.email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(["ADMIN", "OPERATOR"]).default("OPERATOR"),
});

export const CreateUserSchema = UserSchema.omit({
  id: true,
});

export const UpdateUserSchema = UserSchema.omit({ id: true })
  .partial()
  .extend({
    email: z.email("Format email tidak valid").optional(),
  });

export const LoginSchema = z.object({
  email: z.email("Format email tidak valid"),
  password: z.string().min(1, "Password harus diisi"),
});

export const UserResponseSchema = UserSchema.omit({
  password: true,
});

export type UserDto = z.infer<typeof UserSchema>;
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
export type UserResponseDto = z.infer<typeof UserResponseSchema>;
