import {
  IrrigationScheduleResponseDTO,
  SetJadwalDto,
} from "@greenhouse/schemas/irrigation.schema";
import { IIrrigationScheduleService } from "../dependencies/irrigation.dependency";
import { db } from "@greenhouse/database";
import { AppError } from "../../libs/error.lib";
import { IActivityLogService } from "../dependencies/activityLog.dependency";

export class IrrigationService implements IIrrigationScheduleService {
  constructor(private readonly activityLogService: IActivityLogService) {}

  public async getJadwalZona(
    zoneId: number,
  ): Promise<IrrigationScheduleResponseDTO> {
    const zone = await db.irrigationZone.findUnique({
      where: { id: zoneId },
      select: {
        id: true,
        name: true,
        mulaiTanam: true,
        targetPanen: true,
        siklusDasar: true,
        fertigasi: true,
      },
    });

    if (!zone) {
      throw new AppError("Zona irigasi tidak ditemukan", 404);
    }

    let hariSetelahTanam = 0;

    if (zone.mulaiTanam) {
      const hariIni = new Date();
      const tanggalTanam = new Date(zone.mulaiTanam);

      hariIni.setHours(0, 0, 0, 0);
      tanggalTanam.setHours(0, 0, 0, 0);

      const selisihWaktu = hariIni.getTime() - tanggalTanam.getTime();
      hariSetelahTanam = Math.floor(selisihWaktu / (1000 * 3600 * 24));
    }

    const finalHst = hariSetelahTanam > 0 ? hariSetelahTanam : 0;
    let totalNpkUi = "Belum diatur";
    if (zone.fertigasi) {
      const total =
        zone.fertigasi.dosisNitrogen +
        zone.fertigasi.dosisPosfor +
        zone.fertigasi.dosisKalium;
      totalNpkUi = `${total} ppm`;
    }

    return {
      zoneId: zone.id,
      zoneName: zone.name,
      mulaiTanam: zone.mulaiTanam,
      targetPanen: zone.targetPanen,
      siklusDasar: zone.siklusDasar,
      hariSetelahTanam: finalHst,
      formatHstUi: `HARI KE - ${finalHst}`,
      totalNpkUi: totalNpkUi,
    };
  }

  public async setJadwal(
    zoneId: number,
    data: SetJadwalDto,
  ): Promise<IrrigationScheduleResponseDTO> {
    const existingZone = await db.irrigationZone.findUnique({
      where: { id: zoneId },
    });

    if (!existingZone) {
      throw new AppError("Zona irigasi tidak ditemukan", 404);
    }

    if (data.mulaiTanam > data.targetPanen) {
      throw new AppError(
        "Tanggal mulai tanam tidak boleh melebihi target panen",
        400,
      );
    }

    await db.irrigationZone.update({
      where: { id: zoneId },
      data: {
        mulaiTanam: data.mulaiTanam,
        targetPanen: data.targetPanen,
        siklusDasar: data.siklusDasar,
      },
    });

    await this.activityLogService.createLog({
      category: "JADWAL_IRIGASI",
      activity: `Jadwal irigasi untuk '${existingZone.name}' berhasil diatur (Siklus: ${data.siklusDasar} Menit)`,
      status: "SUCCESS",
    });

    return this.getJadwalZona(zoneId);
  }

  public async resetJadwal(
    zoneId: number,
  ): Promise<IrrigationScheduleResponseDTO> {
    const existingZone = await db.irrigationZone.findUnique({
      where: { id: zoneId },
    });

    if (!existingZone) {
      throw new AppError("Zona irigasi tidak ditemukan", 404);
    }

    await db.irrigationZone.update({
      where: { id: zoneId },
      data: {
        mulaiTanam: null,
        targetPanen: null,
        siklusDasar: null,
      },
    });

    await this.activityLogService.createLog({
      category: "JADWAL_IRIGASI",
      activity: `Jadwal irigasi untuk '${existingZone.name}' berhasil di-reset`,
      status: "SUCCESS",
    });

    return this.getJadwalZona(zoneId);
  }
}
