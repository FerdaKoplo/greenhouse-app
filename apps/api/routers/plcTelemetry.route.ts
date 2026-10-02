import { Router } from "express";
import { PLCTelemeteryService } from "../workers/plcTelemetery.worker";
import { PLCTelemeteryController } from "../controllers/plcTelemetery.controller";
import { ActivityLogService } from "../services/implementations/activity-log.implmentation";

const route = Router();

const activityLogService = new ActivityLogService();
const plcTelemeryService = new PLCTelemeteryService(activityLogService);
const plcTelemeteryController = new PLCTelemeteryController(plcTelemeryService);

route.get("/telemetry/latest", plcTelemeteryController.getLatestTelemetry);

route.post("/worker/start", plcTelemeteryController.startWorker);

route.post("/worker/stop", plcTelemeteryController.stopWorker);

export default route;
