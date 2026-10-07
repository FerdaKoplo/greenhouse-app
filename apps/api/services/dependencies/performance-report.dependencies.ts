// import {
//   CreatePerformanceReportDto,
//   PerformanceReportDto,
//   UpdatePerformanceReportDto,
// } from ;

import {
  CreatePerformanceReportDto,
  PerformanceReportDto,
  UpdatePerformanceReportDto,
} from "@greenhouse/schemas";

export interface IPerformanceReportService {
  getReports(limit?: number): Promise<PerformanceReportDto[]>;
  getReportById(id: number): Promise<PerformanceReportDto>;
  createReport(data: CreatePerformanceReportDto): Promise<PerformanceReportDto>;
  updateReport(
    id: number,
    data: UpdatePerformanceReportDto,
  ): Promise<PerformanceReportDto>;
  deleteReport(id: number): Promise<void>;
}
