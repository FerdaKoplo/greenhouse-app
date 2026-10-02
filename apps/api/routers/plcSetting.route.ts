import { Router } from "express";
import { ActivityLogService } from "../services/implementations/activity-log.implmentation";
import { PLCSettingService } from "../services/implementations/plcSetting.implementation";
import { PLCSettingController } from "../controllers/plcSetting.controller";

const route = Router();

const activityLogService = new ActivityLogService();
const plcSettingService = new PLCSettingService(activityLogService);
const plcSettingController = new PLCSettingController(plcSettingService);

route.post("/", plcSettingController.createPLCSetting);

route.get("/:id", plcSettingController.getPLCSetting);

route.patch("/:id", plcSettingController.updatePLCSetting);

export default route;
