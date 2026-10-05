import { db } from "@greenhouse/database";

export const seedFertigationZones = async () => {
  const fertigasi1 = await db.fertigasiZone.upsert({
    where: { zonaId: 1 },
    update: {},
    create: {
      faseTumbuh: "GENERATIF",
      dosisNitrogen: 120,
      dosisPosfor: 150,
      dosisKalium: 200,
      targetEcMin: 1.8,
      targetEcMax: 2.5,
      targetPhMin: 5.8,
      targetPhMax: 6.5,
      zonaId: 1,
    },
  });

  const fertigasi2 = await db.fertigasiZone.upsert({
    where: { zonaId: 2 },
    update: {},
    create: {
      faseTumbuh: "VEGETATIF",
      dosisNitrogen: 200,
      dosisPosfor: 80,
      dosisKalium: 100,
      targetEcMin: 1.2,
      targetEcMax: 1.8,
      targetPhMin: 6.0,
      targetPhMax: 6.8,
      zonaId: 2,
    },
  });

  console.log("Seeding FertigasiZone selesai:");
  console.log({
    zona1Fase: fertigasi1.faseTumbuh,
    zona2Fase: fertigasi2.faseTumbuh,
  });
};
