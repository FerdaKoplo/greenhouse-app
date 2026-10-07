import { Router } from "express";
import { AuthService } from "../services/implementations/auth.implementation";
import { AuthController } from "../controllers/auth.controller";

const route = Router();

const authService = new AuthService();
const authController = new AuthController(authService);

route.post("/login", authController.login);

export default route;
