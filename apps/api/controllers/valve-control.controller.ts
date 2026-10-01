import { db } from "@greenhouse/database";
import { ApiResponse } from "../libs/apiResponse.lib";
import { catchAsync } from "../libs/catchAsync.lib";
import { getValidRecordOrThrow } from "../libs/dbHelper.lib";
import { IValveControlService } from "../services/dependencies/valve-control.dependency";
import { Request, Response } from "express";
import {
  CreateValveControlSchema,
  ToggleValveSchema,
  UpdateValveControlSchema,
} from "@greenhouse/schemas";

export class ValveControlController {
  constructor(private readonly valveControlService: IValveControlService) {}

  public getValvesByZone = catchAsync(
    async (req: Request<{ zoneId: string }>, res: Response) => {
      const { id: zoneId } = await getValidRecordOrThrow({
        idParam: req.params.zoneId,
        findUnique: db.irrigationZone.findUnique,
        notFoundMessage: "Zona irigasi tidak ditemukan",
      });

      const result = await this.valveControlService.getValvesByZone(zoneId);
      return ApiResponse.success(
        res,
        200,
        `Berhasil mengambil daftar valve untuk zona ${zoneId}`,
        result,
      );
    },
  );

  public getValveById = catchAsync(
    async (req: Request<{ id: string }>, res: Response) => {
      const { id } = await getValidRecordOrThrow({
        idParam: req.params.id,
        findUnique: db.valveControl.findUnique,
        notFoundMessage: "Valve tidak ditemukan",
      });

      const result = await this.valveControlService.getValveById(id);
      return ApiResponse.success(
        res,
        200,
        "Berhasil mengambil detail valve",
        result,
      );
    },
  );

  public createValve = catchAsync(async (req: Request, res: Response) => {
    const parsedBody = CreateValveControlSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return ApiResponse.error(
        res,
        400,
        "Format input data valve tidak valid",
        parsedBody.error,
      );
    }

    const result = await this.valveControlService.createValve(parsedBody.data);
    return ApiResponse.success(res, 201, "Berhasil membuat valve baru", result);
  });

  public updateValve = catchAsync(
    async (req: Request<{ id: string }>, res: Response) => {
      const { id } = await getValidRecordOrThrow({
        idParam: req.params.id,
        findUnique: db.valveControl.findUnique,
        notFoundMessage: "Valve tidak ditemukan",
      });

      const parsedBody = UpdateValveControlSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return ApiResponse.error(
          res,
          400,
          "Format input update valve tidak valid",
          parsedBody.error,
        );
      }

      const result = await this.valveControlService.updateValve(
        id,
        parsedBody.data,
      );
      return ApiResponse.success(
        res,
        200,
        "Berhasil memperbarui data valve",
        result,
      );
    },
  );

  public toggleValve = catchAsync(
    async (req: Request<{ id: string }>, res: Response) => {
      const { id } = await getValidRecordOrThrow({
        idParam: req.params.id,
        findUnique: db.valveControl.findUnique,
        notFoundMessage: "Valve tidak ditemukan",
      });

      const parsedBody = ToggleValveSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return ApiResponse.error(
          res,
          400,
          "Format status toggle tidak valid",
          parsedBody.error,
        );
      }

      const result = await this.valveControlService.toggleValve(
        id,
        parsedBody.data,
      );

      const statusMessage = result.isOpen ? "dibuka" : "ditutup";
      return ApiResponse.success(
        res,
        200,
        `Valve berhasil ${statusMessage}`,
        result,
      );
    },
  );

  public deleteValve = catchAsync(
    async (req: Request<{ id: string }>, res: Response) => {
      const { id } = await getValidRecordOrThrow({
        idParam: req.params.id,
        findUnique: db.valveControl.findUnique,
        notFoundMessage: "Valve tidak ditemukan",
      });

      await this.valveControlService.deleteValve(id);
      return ApiResponse.success(res, 200, "Berhasil menghapus valve");
    },
  );
}
