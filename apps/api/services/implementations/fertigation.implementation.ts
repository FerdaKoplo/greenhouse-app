import {
  FertigasiZoneDto,
  FertigationZoneSchema,
  SetFertigasiDto,
  TankStatusResponseDto,
  UpdateDosisNpkDto,
  UpdateTargetParameterDto,
} from "../../../../packages/schemas";
import { IFertigationService } from "../dependencies/fertigation.dependency";

import { AppError } from "../../libs/error.lib";
import { db } from "@greenhouse/database";
import { IActivityLogService } from "../dependencies/activityLog.dependency";

export class FertigationService implements IFertigationService {
  constructor(private readonly activityLogService: IActivityLogService) {}

  public async getFertigationZone(zoneId: number): Promise<FertigasiZoneDto> {
    const fertigation = await db.fertigasiZone.findUnique({
      where: { zonaId: zoneId },
    });

    if (!fertigation) {
      throw new AppError(
        "Konfigurasi fertigasi untuk zona ini belum diatur",
        404,
      );
    }

    return FertigationZoneSchema.parse(fertigation);
  }

  public async setFertigationZone(
    zoneId: number,
    data: SetFertigasiDto,
  ): Promise<FertigasiZoneDto> {
    const upsertedFertigation = await db.fertigasiZone.upsert({
      where: { zonaId: zoneId },
      update: { ...data },
      create: {
        ...data,
        zonaId: zoneId,
      },
    });

    await this.activityLogService.createLog({
      category: "KONFIGURASI_FERTIGASI",
      activity: `Konfigurasi dasar fertigasi untuk Zona ${zoneId} berhasil diatur`,
      status: "SUCCESS",
    });

    return FertigationZoneSchema.parse(upsertedFertigation);
  }

  public async updateDosisNPK(
    zoneId: number,
    data: UpdateDosisNpkDto,
  ): Promise<FertigasiZoneDto> {
    await this.getFertigationZone(zoneId);

    const updated = await db.fertigasiZone.update({
      where: { zonaId: zoneId },
      data,
    });

    await this.activityLogService.createLog({
      category: "KONFIGURASI_FERTIGASI",
      activity: `Dosis NPK Zona ${zoneId} diperbarui (${data.dosisNitrogen}N - ${data.dosisPosfor}P - ${data.dosisKalium}K, Fase: ${data.faseTumbuh})`,
      status: "SUCCESS",
    });

    return FertigationZoneSchema.parse(updated);
  }

  public async updateTargetParameter(
    zoneId: number,
    data: UpdateTargetParameterDto,
  ): Promise<FertigasiZoneDto> {
    await this.getFertigationZone(zoneId);

    const updated = await db.fertigasiZone.update({
      where: { zonaId: zoneId },
      data,
    });

    await this.activityLogService.createLog({
      category: "KONFIGURASI_FERTIGASI",
      activity: `Target EC dan pH untuk Zona ${zoneId} berhasil diperbarui`,
      status: "SUCCESS",
    });

    return FertigationZoneSchema.parse(updated);
  }

  public async getTankStatus(): Promise<TankStatusResponseDto> {
    const latestTelemetry = await db.plcTelemetry.findFirst({
      orderBy: { timestamp: "desc" },
    });

    if (!latestTelemetry) {
      return { tangkiN: 0, tangkiP: 0, tangkiK: 0, isLow: true };
    }

    const telemetry = latestTelemetry as Record<string, unknown>;
    const tangkiN = Number(telemetry.levelTangkiN) || 0;
    const tangkiP = Number(telemetry.levelTangkiP) || 0;
    const tangkiK = Number(telemetry.levelTangkiK) || 0;

    const isLow = tangkiN < 20 || tangkiP < 20 || tangkiK < 20;

    return { tangkiN, tangkiP, tangkiK, isLow };
  }

  public async startDosis(zoneId: number): Promise<void> {
    await db.valveControl.updateMany({
      where: { zonaId: zoneId, type: "NUTRIENT" },
      data: { isOpen: true },
    });

    await this.activityLogService.createLog({
      category: "AKTUATOR",
      activity: `Injeksi otomatis dosis NPK untuk Zona ${zoneId} telah dimulai`,
      status: "SUCCESS",
    });

    console.log(`[ACTION] Memulai injeksi dosis NPK untuk Zona ${zoneId}`);
  }

  public async emergencyStop(zoneId: number): Promise<void> {
    await db.valveControl.updateMany({
      where: { zonaId: zoneId },
      data: { isOpen: false },
    });

    await this.activityLogService.createLog({
      category: "AKTUATOR",
      activity: `PENGHENTIAN DARURAT (Emergency Stop) dieksekusi untuk Zona ${zoneId}`,
      status: "WARNING",
    });

    console.log(
      `[ACTION] PENGHENTIAN DARURAT (EMERGENCY STOP) dieksekusi untuk Zona ${zoneId}`,
    );
  }
}
