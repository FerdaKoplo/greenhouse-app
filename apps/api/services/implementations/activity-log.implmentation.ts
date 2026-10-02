import {
  ActivityLogDto,
  ActivityLogSchema,
  CreateActivityLogDto,
  UpdateActivityLogDto,
} from "@greenhouse/schemas";
import { IActivityLogService } from "../dependencies/activityLog.dependency";
import { db } from "@greenhouse/database";
import { AppError } from "../../libs/error.lib";

export class ActivityLogService implements IActivityLogService {
  public async getLogs(limit: number = 50): Promise<ActivityLogDto[]> {
    const logs = await db.activityLog.findMany({
      orderBy: { timestamp: "desc" },
      take: limit,
    });

    return logs.map((log) => ActivityLogSchema.parse(log));
  }

  public async createLog(data: CreateActivityLogDto): Promise<ActivityLogDto> {
    const newLog = await db.activityLog.create({
      data,
    });

    return ActivityLogSchema.parse(newLog);
  }

  public async updateLog(
    id: number,
    data: UpdateActivityLogDto,
  ): Promise<ActivityLogDto> {
    const existing = await db.activityLog.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("Log aktivitas tidak ditemukan", 404);
    }

    const updated = await db.activityLog.update({
      where: { id },
      data,
    });

    return ActivityLogSchema.parse(updated);
  }

  public async deleteLog(id: number): Promise<void> {
    const existing = await db.activityLog.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("Log aktivitas tidak ditemukan", 404);
    }

    await db.activityLog.delete({ where: { id } });
  }

  public async deleteExpiredLogs(daysToKeep: number = 14): Promise<number> {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - daysToKeep);

    const result = await db.activityLog.deleteMany({
      where: {
        timestamp: {
          lt: expirationDate,
        },
      },
    });

    if (result.count > 0) {
      console.log(
        `[CLEANUP] Berhasil menghapus ${result.count} log aktivitas yang kedaluwarsa.`,
      );
    }

    return result.count;
  }
}
