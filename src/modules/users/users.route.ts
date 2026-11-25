import { Router } from "express";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { userController } from "./users.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateProfileSchema } from "./users.validation";

const router = Router();

const allRoles = [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.TECHNICIAN];

router.get("/me", auth(...allRoles), userController.getMyProfile);

router.patch(
	"/me",
	auth(...allRoles),
	validateRequest(updateProfileSchema),
	userController.updateMyProfile,
);

export const userRoute = router;
