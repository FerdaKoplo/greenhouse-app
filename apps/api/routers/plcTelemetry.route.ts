import { Router } from "express";
import { PLCTelemeteryService } from "../workers/plcTelemetery.worker";
import { PLCTelemeteryController } from "../controllers/plcTelemetery.controller";

const route = Router();
const plcTelemeryService = new PLCTelemeteryService();
const plcTelemeteryController = new PLCTelemeteryController(plcTelemeryService);

route.get("/telemetry/latest", plcTelemeteryController.getLatestTelemetry);

route.post("/worker/start", plcTelemeteryController.startWorker);

route.post("/worker/stop", plcTelemeteryController.stopWorker);

export default route;
