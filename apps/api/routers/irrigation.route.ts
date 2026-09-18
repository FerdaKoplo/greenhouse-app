import { Router } from "express";
import { IrrigationService } from "../services/implementations/irrigation.implementation";

const route = Router();
const irrigationService = new IrrigationService();

route.get();
