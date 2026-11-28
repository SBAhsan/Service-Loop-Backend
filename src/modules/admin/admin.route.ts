import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { adminController } from "./admin.controller";
import { createTechnicianSchema, setTechnicianSkillsSchema } from "./admin.validation";

const router = Router();

router.put(
	"/technicians/:id/skills",
	auth(UserRole.ADMIN),
	validateRequest(setTechnicianSkillsSchema),
	adminController.setTechnicianSkills,
);

router.post(
	"/technicians",
	auth(UserRole.ADMIN),
	validateRequest(createTechnicianSchema),
	adminController.createTechnician,
);

export const adminRoute = router;