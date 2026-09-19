import { Router } from "express";
import { IrrigationService } from "../services/implementations/irrigation.implementation";
import { IrrigationController } from "../controllers/irrigation.controller";
import { requireAuth } from "../middleware/auth.middleware";

const route = Router();
const irrigationService = new IrrigationService();
const irrigationController = new IrrigationController(irrigationService);

route.get("/zones/:zoneId/schedule", irrigationController.getJadwal);

route.post("/zones/:zoneId/schedule", irrigationController.setJadwal);

route.put("/zones/:zoneId/schedule/reset", irrigationController.resetJadwal);

export default route;
