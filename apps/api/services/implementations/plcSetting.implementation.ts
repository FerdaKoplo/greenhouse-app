import {
  CreatePLCSettingDto,
  PLCSettingDto,
  PLCSettingSchema,
  UpdatePLCSettingDto,
} from "@greenhouse/schemas";
import { IActivityLogService } from "../dependencies/activityLog.dependency";
import { IPLCSettingService } from "../dependencies/plcSetting.dependencies";
import { AppError } from "../../libs/error.lib";
import { db } from "@greenhouse/database";

export class PLCSettingService implements IPLCSettingService {
  constructor(private readonly activityLogService: IActivityLogService) {}

  public async getPLCSetting(id: number): Promise<PLCSettingDto> {
    const setting = await db.pLCSetting.findUnique({
      where: { id },
    });

    if (!setting) {
      throw new AppError("Konfigurasi PLC tidak ditemukan", 404);
    }

    return PLCSettingSchema.parse(setting);
  }

  public async createPLCSetting(
    data: CreatePLCSettingDto,
  ): Promise<PLCSettingDto> {
    const newSetting = await db.pLCSetting.create({
      data,
    });

    await this.activityLogService.createLog({
      category: "SISTEM",
      activity: `Konfigurasi PLC baru ditambahkan (IP: ${data.ipAddress}, Interval: ${data.heartbeatInterval}ms)`,
      status: "SUCCESS",
    });

    return PLCSettingSchema.parse(newSetting);
  }

  public async updatePLCSetting(
    id: number,
    data: UpdatePLCSettingDto,
  ): Promise<PLCSettingDto> {
    await this.getPLCSetting(id);

    const updatedSetting = await db.pLCSetting.update({
      where: { id },
      data,
    });

    await this.activityLogService.createLog({
      category: "SISTEM",
      activity: `Konfigurasi PLC (ID: ${id}) diperbarui menjadi IP: ${updatedSetting.ipAddress}`,
      status: "SUCCESS",
    });

    return PLCSettingSchema.parse(updatedSetting);
  }
}
