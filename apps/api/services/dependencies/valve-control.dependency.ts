import {
  CreateValveControlDto,
  ToggleValveDto,
  UpdateValveControlDto,
  ValveControlDto,
} from "@greenhouse/schemas/valve-control.schema";

export interface IValveControlService {
  getValvesByZone(zoneId: number): Promise<ValveControlDto[]>;
  getValveById(id: number): Promise<ValveControlDto>;
  createValve(data: CreateValveControlDto): Promise<ValveControlDto>;
  updateValve(
    id: number,
    data: UpdateValveControlDto,
  ): Promise<ValveControlDto>;
  toggleValve(id: number, data: ToggleValveDto): Promise<ValveControlDto>;
  deleteValve(id: number): Promise<void>;
}
