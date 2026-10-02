import {
  CreateValveControlDto,
  ToggleValveDto,
  UpdateValveControlDto,
  ValveControlDto,
  ValveControlSchema,
} from "@greenhouse/schemas/valve-control.schema";
import { IValveControlService } from "../dependencies/valve-control.dependency";
import { db } from "@greenhouse/database";
import { AppError } from "../../libs/error.lib";
import { IActivityLogService } from "../dependencies/activityLog.dependency";

export class ValveControlService implements IValveControlService {
  constructor(private readonly activityLogService: IActivityLogService) {}

  public async getValvesByZone(zoneId: number): Promise<ValveControlDto[]> {
    const valves = await db.valveControl.findMany({
      where: { zonaId: zoneId },
    });
    return valves.map((valve) => ValveControlSchema.parse(valve));
  }

  public async getValveById(id: number): Promise<ValveControlDto> {
    const valve = await db.valveControl.findUnique({
      where: { id },
    });

    if (!valve) {
      throw new AppError("Valve tidak ditemukan", 404);
    }

    return ValveControlSchema.parse(valve);
  }

  public async createValve(
    data: CreateValveControlDto,
  ): Promise<ValveControlDto> {
    const newValve = await db.valveControl.create({
      data,
    });

    await this.activityLogService.createLog({
      category: "KONFIGURASI_VALVE",
      activity: `Valve '${newValve.name}' (Tipe: ${newValve.type}) berhasil dibuat`,
      status: "SUCCESS",
    });

    return ValveControlSchema.parse(newValve);
  }

  public async updateValve(
    id: number,
    data: UpdateValveControlDto,
  ): Promise<ValveControlDto> {
    await this.getValveById(id);

    const updatedValve = await db.valveControl.update({
      where: { id },
      data,
    });

    await this.activityLogService.createLog({
      category: "KONFIGURASI_VALVE",
      activity: `Data Valve '${updatedValve.name}' (ID: ${id}) berhasil diperbarui`,
      status: "SUCCESS",
    });

    return ValveControlSchema.parse(updatedValve);
  }

  public async toggleValve(
    id: number,
    data: ToggleValveDto,
  ): Promise<ValveControlDto> {
    const valve = await this.getValveById(id);

    const toggledValve = await db.valveControl.update({
      where: { id },
      data: {
        isOpen: data.isOpen,
      },
    });

    await this.activityLogService.createLog({
      category: "AKTUATOR",
      activity: `Valve '${valve.name}' (ID: ${id}) telah ${data.isOpen ? "dibuka" : "ditutup"}`,
      status: "SUCCESS",
    });

    return ValveControlSchema.parse(toggledValve);
  }

  public async deleteValve(id: number): Promise<void> {
    const valve = await this.getValveById(id);

    await db.valveControl.delete({
      where: { id },
    });

    await this.activityLogService.createLog({
      category: "KONFIGURASI_VALVE",
      activity: `Valve '${valve.name}' (ID: ${id}) berhasil dihapus`,
      status: "SUCCESS",
    });
  }
}
