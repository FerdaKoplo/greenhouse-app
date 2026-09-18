import { db } from "@greenhouse/database";
import { IPlcTelemetryWorker } from "../services/dependencies/IplcTelemetryWorker.dependency";

export class PLCTelemeteryService implements IPlcTelemetryWorker {
  private pollingInterval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  public start(intervalMs: number = 5000): void {
    if (this.isRunning) return;
    this.isRunning = true;

    console.log(`PLC Telemetry Worker started (Interval: ${intervalMs}ms)`);

    this.pollingInterval = setInterval(async () => {
      await this.fetchAndSaveTelemetry();
    }, intervalMs);
  }

  public stop() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }

    this.isRunning = false;
    console.log("PLC Telemetry Worker stopped.");
  }

  private async fetchAndSaveTelemetry(): Promise<void> {
    try {
      const simulatedPlcData = {
        inJamAir: 2,
        inJamLampuHidup: 12,
        inJamLampuMati: 12,
        inMenitAir: 30,
        outEc: parseFloat((Math.random() * (2.5 - 1.5) + 1.5).toFixed(2)),
        outKadarAir: parseFloat((Math.random() * (80 - 40) + 40).toFixed(2)),
        outKalium: parseFloat((Math.random() * (20 - 10) + 10).toFixed(2)),
        outKelembaban: parseFloat((Math.random() * (90 - 50) + 50).toFixed(2)),
        outNitrogen: parseFloat((Math.random() * (30 - 15) + 15).toFixed(2)),
        outPh: parseFloat((Math.random() * (7.5 - 5.5) + 5.5).toFixed(2)),
        outPhospor: parseFloat((Math.random() * (15 - 5) + 5).toFixed(2)),
        outSuhu: parseFloat((Math.random() * (35 - 25) + 25).toFixed(2)),
        pupukToggle: Math.random() > 0.5 ? 1 : 0,
      };

      await db.plcTelemetry.create({
        data: simulatedPlcData,
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }
}
