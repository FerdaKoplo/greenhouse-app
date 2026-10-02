import { Router } from "express";
import { IrrigationService } from "../services/implementations/irrigation.implementation";
import { IrrigationController } from "../controllers/irrigation.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { ActivityLogService } from "../services/implementations/activity-log.implmentation";

const route = Router();
const activityLogService = new ActivityLogService();
const irrigationService = new IrrigationService(activityLogService);
const irrigationController = new IrrigationController(irrigationService);

route.use(requireAuth);
route.get("/zones/:zoneId/schedule", irrigationController.getJadwal);

route.post("/zones/:zoneId/schedule", irrigationController.setJadwal);

route.put("/zones/:zoneId/schedule/reset", irrigationController.resetJadwal);

export default route;
