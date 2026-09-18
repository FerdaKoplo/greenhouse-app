import { db } from "@greenhouse/database";
import { AppError } from "./error.lib";

type AllowedRole = "ADMIN" | "OPERATOR";

const ROLE_ERROR_MESSAGES: Record<AllowedRole, string> = {
  ADMIN: "Akses ditolak: Tindakan ini memerlukan hak akses Admin.",
  OPERATOR: "Akses ditolak: Tindakan ini memerlukan hak akses Operator.",
};

export async function getRoleIdOrThrow(
  userId: number | undefined,
  requiredRoles: AllowedRole | AllowedRole[],
): Promise<AllowedRole> {
  if (!userId) {
    throw new AppError("Unauthorized: Missing user identity", 401);
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
    },
  });

  if (!user) {
    throw new AppError("Unauthorized: Pengguna tidak ditemukan", 401);
  }

  const rolesToCheck = Array.isArray(requiredRoles)
    ? requiredRoles
    : [requiredRoles];

  if (!rolesToCheck.includes(user?.role as AllowedRole)) {
    throw new AppError(ROLE_ERROR_MESSAGES[rolesToCheck[0]], 403);
  }

  return user.role as AllowedRole;
}
