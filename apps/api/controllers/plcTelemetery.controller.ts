import { db } from "@greenhouse/database";
import { ApiResponse } from "../libs/apiResponse.lib";
import { catchAsync } from "../libs/catchAsync.lib";
import { IPlcTelemetryWorker } from "../services/dependencies/IplcTelemetryWorker.dependency";
import { Request, Response, NextFunction } from "express";

export class PLCTelemeteryController {
  constructor(private readonly plcWorker: IPlcTelemetryWorker) {}

  public startWorker = catchAsync(async (req: Request, res: Response) => {
    const intervalMs = req.body.intervalMs
      ? parseInt(req.body.intervalMs, 10)
      : 5000;

    this.plcWorker.start(intervalMs);

    return ApiResponse.success(
      res,
      200,
      `Worker PLC berhasil dijalankan dengan interval ${intervalMs}ms`,
    );
  });

  public stopWorker = catchAsync(async (req: Request, res: Response) => {
    this.plcWorker.stop();

    return ApiResponse.success(res, 200, "Worker PLC berhasil dihentikan");
  });

  public getLatestTelemetry = catchAsync(
    async (req: Request, res: Response) => {
      const latestData = await db.plcTelemetry.findFirst({
        orderBy: { timestamp: "desc" },
      });

      if (!latestData) {
        return ApiResponse.success(
          res,
          200,
          "Data telemetri masih kosong",
          null,
        );
      }

      return ApiResponse.success(
        res,
        200,
        "Berhasil mengambil data telemetri terbaru",
        latestData,
      );
    },
  );
}
