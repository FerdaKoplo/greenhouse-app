import { Router } from "express";
import { ValveControlService } from "../services/implementations/valve-control.implementation";
import { ValveControlController } from "../controllers/valve-control.controller";

const route = Router();

const valveControlService = new ValveControlService();
const valveControlController = new ValveControlController(valveControlService);

route.get("/zones/:zoneId", valveControlController.getValvesByZone);

route.post("/", valveControlController.createValve);

route.get("/:id", valveControlController.getValveById);

route.patch("/:id", valveControlController.updateValve);

route.delete("/:id", valveControlController.deleteValve);

route.patch("/:id/toggle", valveControlController.toggleValve);

export default route;
