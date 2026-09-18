import {
  IrrigationScheduleResponseDTO,
  SetJadwalDto,
} from "@greenhouse/schemas/irrigation.schema";

export interface IIrrigationScheduleService {
  getJadwalZona(zoneId: number): Promise<IrrigationScheduleResponseDTO>;
  setJadwal(
    zoneId: number,
    data: SetJadwalDto,
  ): Promise<IrrigationScheduleResponseDTO>;
  resetJadwal(zoneId: number): Promise<IrrigationScheduleResponseDTO>;
}
