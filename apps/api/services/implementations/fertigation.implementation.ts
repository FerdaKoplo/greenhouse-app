import {
  FertigasiZoneDto,
  SetFertigasiDto,
  TankStatusResponseDto,
  UpdateDosisNpkDto,
  UpdateTargetParameterDto,
} from "../../../../packages/schemas";
import { IFertigationService } from "../dependencies/fertigation.dependency";

import { AppError } from "../../libs/error.lib";
import { db } from "@greenhouse/database";

export class FertigationService implements IFertigationService {
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

    return fertigation;
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

    return upsertedFertigation;
  }

  public async updateDosisNPK(
    zoneId: number,
    data: UpdateDosisNpkDto,
  ): Promise<FertigasiZoneDto> {
    const existing = await db.fertigasiZone.findUnique({
      where: { zonaId: zoneId },
    });

    if (!existing) {
      throw new AppError(
        "Konfigurasi fertigasi belum ada. Lakukan setup awal terlebih dahulu.",
        400,
      );
    }

    const updated = await db.fertigasiZone.update({
      where: { zonaId: zoneId },
      data: {
        faseTumbuh: data.faseTumbuh,
        dosisNitrogen: data.dosisNitrogen,
        dosisPosfor: data.dosisPosfor,
        dosisKalium: data.dosisKalium,
      },
    });

    return updated;
  }

  public async updateTargetParameter(
    zoneId: number,
    data: UpdateTargetParameterDto,
  ): Promise<FertigasiZoneDto> {
    const existing = await db.fertigasiZone.findUnique({
      where: { zonaId: zoneId },
    });

    if (!existing) {
      throw new AppError(
        "Konfigurasi fertigasi belum ada. Lakukan setup awal terlebih dahulu.",
        400,
      );
    }

    const updated = await db.fertigasiZone.update({
      where: { zonaId: zoneId },
      data: {
        targetEcMin: data.targetEcMin,
        targetEcMax: data.targetEcMax,
        targetPhMin: data.targetPhMin,
        targetPhMax: data.targetPhMax,
      },
    });

    return updated;
  }

  public async getTankStatus(): Promise<TankStatusResponseDto> {
    const latestTelemetry = await db.plcTelemetry.findFirst({
      orderBy: { timestamp: "desc" },
    });

    if (!latestTelemetry) {
      return { tangkiN: 0, tangkiP: 0, tangkiK: 0, isLow: true };
    }

    const tangkiN = (latestTelemetry as any).levelTangkiN || 0;
    const tangkiP = (latestTelemetry as any).levelTangkiP || 0;
    const tangkiK = (latestTelemetry as any).levelTangkiK || 0;

    const isLow = tangkiN < 20 || tangkiP < 20 || tangkiK < 20;

    return { tangkiN, tangkiP, tangkiK, isLow };
  }

  public async startDosis(zoneId: number): Promise<void> {
    await db.valveControl.updateMany({
      where: { zonaId: zoneId, type: "NUTRIENT" },
      data: { isOpen: true },
    });

    console.log(`[ACTION] Memulai injeksi dosis NPK untuk Zona ${zoneId}`);
  }

  public async emergencyStop(zoneId: number): Promise<void> {
    await db.valveControl.updateMany({
      where: { zonaId: zoneId },
      data: { isOpen: false },
    });

    console.log(
      `[ACTION] PENGHENTIAN DARURAT (EMERGENCY STOP) dieksekusi untuk Zona ${zoneId}`,
    );
  }
}
