import { db } from "@greenhouse/database";

export const seedPerformanceReports = async () => {
  const hariIni = new Date();
  hariIni.setHours(0, 0, 0, 0);

  const kemarin = new Date(hariIni);
  kemarin.setDate(kemarin.getDate() - 1);

  await db.performanceReport.upsert({
    where: { date: kemarin },
    update: {},
    create: {
      date: kemarin,
      estimasiHasil: 85.5,
      penggunaanAir: 120.0,
      konsumsiNutrisi: 5.2,
      waktuAktifCo2: 4.5,
    },
  });

  await db.performanceReport.upsert({
    where: { date: hariIni },
    update: {},
    create: {
      date: hariIni,
      estimasiHasil: 88.0,
      penggunaanAir: 115.5,
      konsumsiNutrisi: 4.8,
      waktuAktifCo2: 5.0,
    },
  });

  console.log("Seeding Performance Reports selesai");
};
