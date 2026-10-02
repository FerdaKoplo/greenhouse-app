import { db } from "@greenhouse/database";
import { catchAsync } from "../libs/catchAsync.lib";
import { getValidRecordOrThrow } from "../libs/dbHelper.lib";
import { IPLCSettingService } from "../services/dependencies/plcSetting.dependencies";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../libs/apiResponse.lib";
import {
  CreatePLCSettingSchema,
  UpdatePLCSettingSchema,
} from "@greenhouse/schemas";

export class PLCSettingController {
  constructor(private readonly plcSetting: IPLCSettingService) {}

  public getPLCSetting = catchAsync(
    async (req: Request<{ id: string }>, res: Response) => {
      const { id } = await getValidRecordOrThrow({
        idParam: req.params.id,
        findUnique: db.pLCSetting.findUnique,
        notFoundMessage: "Konfigurasi PLC tidak ditemukan",
      });

      const result = await this.plcSetting.getPLCSetting(id);

      return ApiResponse.success(
        res,
        200,
        "Berhasil mengambil konfigurasi PLC",
        result,
      );
    },
  );

  public createPLCSetting = catchAsync(async (req: Request, res: Response) => {
    const parsedBody = CreatePLCSettingSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return ApiResponse.error(
        res,
        400,
        "Format input data konfigurasi PLC tidak valid",
        parsedBody.error,
      );
    }

    const result = await this.plcSetting.createPLCSetting(parsedBody.data);

    return ApiResponse.success(
      res,
      201,
      "Berhasil menyimpan konfigurasi PLC baru",
      result,
    );
  });

  public updatePLCSetting = catchAsync(
    async (req: Request<{ id: string }>, res: Response) => {
      const { id } = await getValidRecordOrThrow({
        idParam: req.params.id,
        findUnique: db.pLCSetting.findUnique,
        notFoundMessage: "Konfigurasi PLC tidak ditemukan",
      });

      const parsedBody = UpdatePLCSettingSchema.safeParse(req.body);

      if (!parsedBody.success) {
        return ApiResponse.error(
          res,
          400,
          "Format input update konfigurasi PLC tidak valid",
          parsedBody.error,
        );
      }

      const result = await this.plcSetting.updatePLCSetting(
        id,
        parsedBody.data,
      );

      return ApiResponse.success(
        res,
        200,
        "Berhasil memperbarui konfigurasi PLC",
        result,
      );
    },
  );
}
