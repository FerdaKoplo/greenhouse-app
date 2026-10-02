import {
  ActivityLogDto,
  CreateActivityLogDto,
  UpdateActivityLogDto,
} from "@greenhouse/schemas";

export interface IActivityLogService {
  getLogs(limit?: number): Promise<ActivityLogDto[]>;

  createLog(data: CreateActivityLogDto): Promise<ActivityLogDto>;

  updateLog(id: number, data: UpdateActivityLogDto): Promise<ActivityLogDto>;
  deleteLog(id: number): Promise<void>;
  deleteExpiredLogs(daysToKeep?: number): Promise<number>;
}
