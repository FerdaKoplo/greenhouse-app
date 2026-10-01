import {
  FertigasiZoneDto,
  SetFertigasiDto,
  TankStatusResponseDto,
  UpdateDosisNpkDto,
  UpdateTargetParameterDto,
} from "../../../../packages/schemas/fertigation.schema";

export interface IFertigationService {
  getFertigationZone(zoneId: number): Promise<FertigasiZoneDto>;
  setFertigationZone(
    zoneId: number,
    data: SetFertigasiDto,
  ): Promise<FertigasiZoneDto>;
  updateDosisNPK(
    zoneId: number,
    data: UpdateDosisNpkDto,
  ): Promise<FertigasiZoneDto>;
  updateTargetParameter(
    zoneId: number,
    data: UpdateTargetParameterDto,
  ): Promise<FertigasiZoneDto>;
  getTankStatus(): Promise<TankStatusResponseDto>;
  startDosis(zoneId: number): Promise<void>;
  emergencyStop(zoneId: number): Promise<void>;
}
