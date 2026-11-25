import { Router } from "express";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { userController } from "./users.controller";

const router = Router();

const allRoles = [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.TECHNICIAN];

router.get("/me", auth(...allRoles), userController.getMyProfile);

export const authRoute = router;

