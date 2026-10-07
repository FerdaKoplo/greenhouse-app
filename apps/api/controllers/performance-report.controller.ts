import { db } from "@greenhouse/database";
import { ApiResponse } from "../libs/apiResponse.lib";
import { catchAsync } from "../libs/catchAsync.lib";
import { getValidRecordOrThrow } from "../libs/dbHelper.lib";
import { IPerformanceReportService } from "../services/dependencies/performance-report.dependencies";
import { Request, Response, NextFunction } from "express";
import z from "zod";
import {
  CreatePerformanceReportSchema,
  UpdatePerformanceReportSchema,
} from "@greenhouse/schemas";

export class PerformanceReportController {
  constructor(
    private readonly performanceReportService: IPerformanceReportService,
  ) {}

  public getReports = catchAsync(async (req: Request, res: Response) => {
    const querySchema = z.object({
      limit: z.coerce.number().int().positive().optional(),
    });

    const parsedQuery = querySchema.safeParse(req.query);
    if (!parsedQuery.success) {
      return ApiResponse.error(
        res,
        400,
        "Parameter query tidak valid",
        parsedQuery.error,
      );
    }

    const limit = parsedQuery.data.limit;

    const result = await this.performanceReportService.getReports(limit);

    return ApiResponse.success(
      res,
      200,
      "Berhasil mengambil daftar laporan performa",
      result,
    );
  });

  public getReportById = catchAsync(
    async (req: Request<{ id: string }>, res: Response) => {
      const { id } = await getValidRecordOrThrow({
        idParam: req.params.id,
        findUnique: db.performanceReport.findUnique,
        notFoundMessage: "Laporan performa tidak ditemukan",
      });

      const result = await this.performanceReportService.getReportById(id);

      return ApiResponse.success(
        res,
        200,
        "Berhasil mengambil detail laporan performa",
        result,
      );
    },
  );

  public createReport = catchAsync(async (req: Request, res: Response) => {
    const parsedBody = CreatePerformanceReportSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return ApiResponse.error(
        res,
        400,
        "Format input data laporan performa tidak valid",
        parsedBody.error,
      );
    }

    const result = await this.performanceReportService.createReport(
      parsedBody.data,
    );

    return ApiResponse.success(
      res,
      201,
      "Berhasil membuat laporan performa baru",
      result,
    );
  });

  public updateReport = catchAsync(
    async (req: Request<{ id: string }>, res: Response) => {
      const { id } = await getValidRecordOrThrow({
        idParam: req.params.id,
        findUnique: db.performanceReport.findUnique,
        notFoundMessage: "Laporan performa tidak ditemukan",
      });

      const parsedBody = UpdatePerformanceReportSchema.safeParse(req.body);

      if (!parsedBody.success) {
        return ApiResponse.error(
          res,
          400,
          "Format input update laporan performa tidak valid",
          parsedBody.error,
        );
      }

      const result = await this.performanceReportService.updateReport(
        id,
        parsedBody.data,
      );

      return ApiResponse.success(
        res,
        200,
        "Berhasil memperbarui data laporan performa",
        result,
      );
    },
  );

  public deleteReport = catchAsync(
    async (req: Request<{ id: string }>, res: Response) => {
      const { id } = await getValidRecordOrThrow({
        idParam: req.params.id,
        findUnique: db.performanceReport.findUnique,
        notFoundMessage: "Laporan performa tidak ditemukan",
      });

      await this.performanceReportService.deleteReport(id);

      return ApiResponse.success(
        res,
        200,
        "Berhasil menghapus laporan performa",
      );
    },
  );
}
