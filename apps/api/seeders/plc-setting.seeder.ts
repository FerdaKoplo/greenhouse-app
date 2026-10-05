import { db } from "@greenhouse/database";

export const seedPLCSettings = async () => {
  await db.pLCSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      ipAddress: "192.168.1.100",
      heartbeatInterval: 5000,
    },
  });

  console.log("Seeding PLC Settings selesai");
};
