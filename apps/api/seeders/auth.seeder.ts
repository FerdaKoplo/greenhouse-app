import bcrypt from "bcrypt";
import { db } from "@greenhouse/database";

export const seedUsers = async () => {
  const saltRounds = 10;

  const hashedAdminPassword = await bcrypt.hash("admin1234", saltRounds);
  const hashedOperatorPassword = await bcrypt.hash("operator1234", saltRounds);

  const admin = await db.user.upsert({
    where: { name: "admin_utama" },
    update: {},
    create: {
      name: "admin_utama",
      password: hashedAdminPassword,
      role: "ADMIN",
    },
  });

  const operator = await db.user.upsert({
    where: { name: "operator_satu" },
    update: {},
    create: {
      name: "operator_satu",
      password: hashedOperatorPassword,
      role: "OPERATOR",
    },
  });

  console.log("Seeding selesai:");
  console.log({ admin: admin.name, operator: operator.name });
};
