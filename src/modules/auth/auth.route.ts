import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { loginUserSchema, registerUserSchema } from "./auth.validation";

const router = Router();

router.post('/register', validateRequest(registerUserSchema), authController.registerUser);

router.post('/login', validateRequest(loginUserSchema), authController.loginUser);

router.post('/refresh-token', authController.refreshToken);

router.get('/me', auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.TECHNICIAN), authController.getMe)

export const authRoute = router;