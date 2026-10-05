import { db } from "@greenhouse/database";

export const seedValveControls = async () => {
  await db.valveControl.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Valve Air - Zona A",
      type: "WATER",
      isOpen: false,
      zonaId: 1,
    },
  });

  await db.valveControl.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Valve Nutrisi - Zona A",
      type: "NUTRIENT",
      isOpen: false,
      zonaId: 1,
    },
  });

  await db.valveControl.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: "Valve Air - Zona B",
      type: "WATER",
      isOpen: false,
      zonaId: 2,
    },
  });

  await db.valveControl.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: "Main Water Valve",
      type: "MAIN_WATER",
      isOpen: true,
      zonaId: null,
    },
  });

  console.log("Seeding Valve Controls selesai");
};
