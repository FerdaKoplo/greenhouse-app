import { db } from "@greenhouse/database";

async function main() {
  const zone1 = await db.irrigationZone.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Zona A - Tomat Cherry",
      status: "AKTIF",
      lajuAlir: 1.5,
      targetDurasi: "30 Menit",
      terakhirJalan: new Date(),
      mulaiTanam: new Date(new Date().setDate(new Date().getDate() - 2)),
      targetPanen: new Date(new Date().setDate(new Date().getDate() + 60)),
      siklusDasar: 60,
      targetNpk: "1000",
    },
  });

  const zone2 = await db.irrigationZone.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Zona B - Selada Air",
      status: "STANDBY",
      lajuAlir: 2.0,
      targetDurasi: "15 Menit",
      targetNpk: "0",
      terakhirJalan: null,
      mulaiTanam: null,
      targetPanen: null,
      siklusDasar: null,
    },
  });

  console.log("Seeding IrrigationZone selesai:");
  console.log({ zone1: zone1.name, zone2: zone2.name });
}

main()
  .catch((e) => {
    console.error("Gagal melakukan seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
