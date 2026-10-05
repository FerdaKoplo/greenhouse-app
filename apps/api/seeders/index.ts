import { db } from "@greenhouse/database";
import { seedUsers } from "./auth.seeder";
import { seedIrrigationZones } from "./irrigation.seeder";
import { seedFertigationZones } from "./fertigation.seeder";
import { seedTelemetry } from "./plc-telemetery.seeder";
import { seedPerformanceReports } from "./performance-report.seeder";
import { seedValveControls } from "./valve-control.seeder";
import { seedPLCSettings } from "./plc-setting.seeder";

async function main() {
  await seedUsers();
  await seedIrrigationZones();
  await seedFertigationZones();
  await seedTelemetry();
  await seedPerformanceReports();
  await seedValveControls();
  await seedPLCSettings();
}

main()
  .catch((e) => {
    console.error("Gagal melakukan seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
