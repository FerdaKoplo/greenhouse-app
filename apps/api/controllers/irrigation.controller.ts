import { ApiResponse } from "../libs/apiResponse.lib";
import { catchAsync } from "../libs/catchAsync.lib";
import { Request, Response, NextFunction } from "express";
import { IIrrigationScheduleService } from "../services/dependencies/irrigation.dependency";
import { getValidRecordOrThrow } from "../libs/dbHelper.lib";
import { db } from "@greenhouse/database";
import { SetJadwalSchema } from "@greenhouse/schemas/irrigation.schema";

export class IrrigationController {
  constructor(private readonly irrigationService: IIrrigationScheduleService) {}

  public getJadwal = catchAsync(
    async (req: Request<{ zoneId: string }>, res: Response) => {
      const { id: zoneId } = await getValidRecordOrThrow({
        idParam: req.params.zoneId,
        findUnique: db.irrigationZone.findUnique,
        notFoundMessage: "Zona irigasi tidak ditemukan",
      });

      const result = await this.irrigationService.getJadwalZona(zoneId);

      return ApiResponse.success(
        res,
        200,
        "Berhasil mengambil jadwal zona",
        result,
      );
    },
  );

  public setJadwal = catchAsync(
    async (req: Request<{ zoneId: string }>, res: Response) => {
      const { id: zoneId } = await getValidRecordOrThrow({
        idParam: req.params.zoneId,
        findUnique: db.irrigationZone.findUnique,
        notFoundMessage: "Zona irigasi tidak ditemukan",
      });

      const parsedBody = SetJadwalSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return ApiResponse.error(
          res,
          400,
          "Format input tidak valid",
          parsedBody.error,
        );
      }

      const result = await this.irrigationService.setJadwal(
        zoneId,
        parsedBody.data,
      );

      return ApiResponse.success(
        res,
        200,
        "Berhasil menyimpan jadwal zona",
        result,
      );
    },
  );

  public resetJadwal = catchAsync(
    async (req: Request<{ zoneId: string }>, res: Response) => {
      const { id: zoneId } = await getValidRecordOrThrow({
        idParam: req.params.zoneId,
        findUnique: db.irrigationZone.findUnique,
        notFoundMessage: "Zona irigasi tidak ditemukan",
      });

      const result = await this.irrigationService.resetJadwal(zoneId);
      return ApiResponse.success(
        res,
        200,
        "Berhasil mereset jadwal zona",
        result,
      );
    },
  );
}
