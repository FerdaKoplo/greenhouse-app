import { Router } from "express";
import { ActivityLogService } from "../services/implementations/activity-log.implmentation";
import { PerformanceReportService } from "../services/implementations/performance-report.implementation";
import { PerformanceReportController } from "../controllers/performance-report.controller";

const route = Router();

const activityLogService = new ActivityLogService();
const performanceReportService = new PerformanceReportService(
  activityLogService,
);
const performanceReportController = new PerformanceReportController(
  performanceReportService,
);

route.get("/", performanceReportController.getReports);
route.post("/", performanceReportController.createReport);
route.get("/:id", performanceReportController.getReportById);
route.patch("/:id", performanceReportController.updateReport);
route.delete("/:id", performanceReportController.deleteReport);

export default route;
