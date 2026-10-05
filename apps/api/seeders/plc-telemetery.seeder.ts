import { db } from "@greenhouse/database";

export const seedTelemetry = async () => {
  await db.pLCSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      ipAddress: "192.168.1.100",
      heartbeatInterval: 5000,
    },
  });
  console.log("Seeding PLC Setting selesai");

  await db.plcTelemetry.createMany({
    data: [
      {
        outEc: 1.8,
        outKadarAir: 65.5,
        outKelembaban: 80.0,
        outPh: 6.2,
        outSuhu: 28.5,
        outNitrogen: 120,
        outPhospor: 45,
        outKalium: 180,
        inJamAir: 2,
        inJamLampuHidup: 12,
        inJamLampuMati: 12,
        inMenitAir: 30,
        pupukToggle: 1,
        zonaId: 1,
      },
      {
        outEc: 1.9,
        outKadarAir: 64.0,
        outKelembaban: 78.5,
        outPh: 6.1,
        outSuhu: 29.0,
        outNitrogen: 115,
        outPhospor: 42,
        outKalium: 175,
        inJamAir: 2,
        inJamLampuHidup: 12,
        inJamLampuMati: 12,
        inMenitAir: 30,
        pupukToggle: 0,
        zonaId: 1,
      },
    ],
  });

  console.log("Seeding PLC Telemetry (Data Sensor) selesai");
};
