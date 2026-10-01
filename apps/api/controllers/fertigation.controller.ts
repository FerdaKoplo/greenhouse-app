import { ApiResponse } from "../libs/apiResponse.lib";
import { catchAsync } from "../libs/catchAsync.lib";
import { getValidRecordOrThrow } from "../libs/dbHelper.lib";
import { Request, Response, NextFunction } from "express";
import { IFertigationService } from "../services/dependencies/fertigation.dependency";
import { db } from "@greenhouse/database";
import {
  SetFertigationSchema,
  UpdateDosisNpkSchema,
  UpdateTargetParameterSchema,
} from "@greenhouse/schemas";

export class FertigationController {
  constructor(private readonly fertigationService: IFertigationService) {}

  public getFertigationZone = catchAsync(
    async (req: Request<{ zoneId: string }>, res: Response) => {
      const { id: zoneId } = await getValidRecordOrThrow({
        idParam: req.params.zoneId,
        findUnique: db.irrigationZone.findUnique,
        notFoundMessage: "Zona irigasi tidak ditemukan",
      });

      const result = await this.fertigationService.getFertigationZone(zoneId);
      return ApiResponse.success(
        res,
        200,
        "Berhasil mengambil data fertigasi zona",
        result,
      );
    },
  );

  public setFertigationZone = catchAsync(
    async (req: Request<{ zoneId: string }>, res: Response) => {
      const { id: zoneId } = await getValidRecordOrThrow({
        idParam: req.params.zoneId,
        findUnique: db.irrigationZone.findUnique,
        notFoundMessage: "Zona irigasi tidak ditemukan",
      });

      const parsedBody = SetFertigationSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return ApiResponse.error(
          res,
          400,
          "Format input tidak valid",
          parsedBody.error,
        );
      }

      const result = await this.fertigationService.setFertigationZone(
        zoneId,
        parsedBody.data,
      );
      return ApiResponse.success(
        res,
        200,
        "Berhasil menyimpan konfigurasi fertigasi",
        result,
      );
    },
  );

  public updateDosisNpk = catchAsync(
    async (req: Request<{ zoneId: string }>, res: Response) => {
      const { id: zoneId } = await getValidRecordOrThrow({
        idParam: req.params.zoneId,
        findUnique: db.irrigationZone.findUnique,
        notFoundMessage: "Zona irigasi tidak ditemukan",
      });

      const parsedBody = UpdateDosisNpkSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return ApiResponse.error(
          res,
          400,
          "Format input dosis NPK tidak valid",
          parsedBody.error,
        );
      }

      const result = await this.fertigationService.updateDosisNPK(
        zoneId,
        parsedBody.data,
      );
      return ApiResponse.success(
        res,
        200,
        "Berhasil memperbarui dosis NPK",
        result,
      );
    },
  );

  public updateTargetParameter = catchAsync(
    async (req: Request<{ zoneId: string }>, res: Response) => {
      const { id: zoneId } = await getValidRecordOrThrow({
        idParam: req.params.zoneId,
        findUnique: db.irrigationZone.findUnique,
        notFoundMessage: "Zona irigasi tidak ditemukan",
      });

      const parsedBody = UpdateTargetParameterSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return ApiResponse.error(
          res,
          400,
          "Format input parameter target tidak valid",
          parsedBody.error,
        );
      }

      const result = await this.fertigationService.updateTargetParameter(
        zoneId,
        parsedBody.data,
      );
      return ApiResponse.success(
        res,
        200,
        "Berhasil memperbarui parameter target EC & pH",
        result,
      );
    },
  );

  public getTankStatus = catchAsync(async (_req: Request, res: Response) => {
    const result = await this.fertigationService.getTankStatus();
    return ApiResponse.success(
      res,
      200,
      "Berhasil mengambil status tangki nutrisi",
      result,
    );
  });

  public startDosis = catchAsync(
    async (req: Request<{ zoneId: string }>, res: Response) => {
      const { id: zoneId } = await getValidRecordOrThrow({
        idParam: req.params.zoneId,
        findUnique: db.irrigationZone.findUnique,
        notFoundMessage: "Zona irigasi tidak ditemukan",
      });

      await this.fertigationService.startDosis(zoneId);
      return ApiResponse.success(
        res,
        200,
        `Injeksi dosis NPK untuk zona ${zoneId} berhasil dimulai`,
      );
    },
  );

  public emergencyStop = catchAsync(
    async (req: Request<{ zoneId: string }>, res: Response) => {
      const { id: zoneId } = await getValidRecordOrThrow({
        idParam: req.params.zoneId,
        findUnique: db.irrigationZone.findUnique,
        notFoundMessage: "Zona irigasi tidak ditemukan",
      });

      await this.fertigationService.emergencyStop(zoneId);
      return ApiResponse.success(
        res,
        200,
        `Penghentian darurat (Emergency Stop) berhasil dieksekusi untuk zona ${zoneId}`,
      );
    },
  );
}
