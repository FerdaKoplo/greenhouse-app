import {
  CreatePLCSettingDto,
  PLCSettingDto,
  UpdatePLCSettingDto,
} from "@greenhouse/schemas";

export interface IPLCSettingService {
  getPLCSetting(id: number): Promise<PLCSettingDto>;
  createPLCSetting(data: CreatePLCSettingDto): Promise<PLCSettingDto>;
  updatePLCSetting(
    id: number,
    data: UpdatePLCSettingDto,
  ): Promise<PLCSettingDto>;
}
