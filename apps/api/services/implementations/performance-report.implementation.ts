import {
  CreatePerformanceReportDto,
  PerformanceReportDto,
  PerformanceReportSchema,
  UpdatePerformanceReportDto,
} from "@greenhouse/schemas/performanceReport.schema";
import { IPerformanceReportService } from "../dependencies/performance-report.dependencies";
import { IActivityLogService } from "../dependencies/activityLog.dependency";
import { db } from "@greenhouse/database";
import { AppError } from "../../libs/error.lib";

export class PerformanceReportService implements IPerformanceReportService {
  constructor(private readonly activityLogService: IActivityLogService) {}

  public async getReports(limit: number = 30): Promise<PerformanceReportDto[]> {
    const reports = await db.performanceReport.findMany({
      orderBy: { date: "desc" },
      take: limit,
    });

    return reports.map((report) => PerformanceReportSchema.parse(report));
  }

  public async getReportById(id: number): Promise<PerformanceReportDto> {
    const report = await db.performanceReport.findUnique({
      where: { id },
    });

    if (!report) {
      throw new AppError("Laporan performa tidak ditemukan", 404);
    }

    return PerformanceReportSchema.parse(report);
  }

  public async createReport(
    data: CreatePerformanceReportDto,
  ): Promise<PerformanceReportDto> {
    const newReport = await db.performanceReport.create({
      data,
    });

    const dateString = data.date.toISOString().split("T")[0];

    await this.activityLogService.createLog({
      category: "LAPORAN_PERFORMA",
      activity: `Laporan performa baru dibuat untuk tanggal ${dateString}`,
      status: "SUCCESS",
    });

    return PerformanceReportSchema.parse(newReport);
  }

  public async updateReport(
    id: number,
    data: UpdatePerformanceReportDto,
  ): Promise<PerformanceReportDto> {
    await this.getReportById(id);

    const updatedReport = await db.performanceReport.update({
      where: { id },
      data,
    });

    await this.activityLogService.createLog({
      category: "LAPORAN_PERFORMA",
      activity: `Data laporan performa (ID: ${id}) berhasil diperbarui`,
      status: "SUCCESS",
    });

    return PerformanceReportSchema.parse(updatedReport);
  }

  public async deleteReport(id: number): Promise<void> {
    await this.getReportById(id);

    await db.performanceReport.delete({
      where: { id },
    });

    await this.activityLogService.createLog({
      category: "LAPORAN_PERFORMA",
      activity: `Laporan performa (ID: ${id}) berhasil dihapus`,
      status: "SUCCESS",
    });
  }
}
