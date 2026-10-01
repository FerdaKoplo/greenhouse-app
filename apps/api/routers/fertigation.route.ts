import { Router } from "express";
import { FertigationService } from "../services/implementations/fertigation.implementation";
import { FertigationController } from "../controllers/fertigation.controller";

const route = Router();

const fertigationService = new FertigationService();
const fertigationController = new FertigationController(fertigationService);

route.get(
  "/zones/:zoneId/fertigation",
  fertigationController.getFertigationZone,
);

route.put(
  "/zones/:zoneId/fertigation",
  fertigationController.setFertigationZone,
);

route.patch(
  "/zones/:zoneId/fertigation/dosis",
  fertigationController.updateDosisNpk,
);

route.patch(
  "/zones/:zoneId/fertigation/parameters",
  fertigationController.updateTargetParameter,
);

route.get("/telemetry/tanks", fertigationController.getTankStatus);

route.post(
  "/zones/:zoneId/fertigation/start",
  fertigationController.startDosis,
);

route.post(
  "/zones/:zoneId/fertigation/emergency-stop",
  fertigationController.emergencyStop,
);

export default route;
