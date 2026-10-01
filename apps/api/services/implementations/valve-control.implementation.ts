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

export class ValveControlService implements IValveControlService {
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

    return ValveControlSchema.parse(updatedValve);
  }

  public async toggleValve(
    id: number,
    data: ToggleValveDto,
  ): Promise<ValveControlDto> {
    await this.getValveById(id);

    const toggledValve = await db.valveControl.update({
      where: { id },
      data: {
        isOpen: data.isOpen,
      },
    });

    return ValveControlSchema.parse(toggledValve);
  }

  public async deleteValve(id: number): Promise<void> {
    await this.getValveById(id);

    await db.valveControl.delete({
      where: { id },
    });
  }
}
