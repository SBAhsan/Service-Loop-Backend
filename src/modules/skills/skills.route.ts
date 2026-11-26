import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { createSkillSchema } from "./skills.validation";
import { skillController } from "./skills.controller";
import { UserRole } from "../../../prisma/generated/prisma/enums";

const router = Router();

router.get("/", skillController.getAllSkills);

router.post(
	"/",
	auth(UserRole.ADMIN),
	validateRequest(createSkillSchema),
	skillController.createSkill,
);

export const skillRoute = router;