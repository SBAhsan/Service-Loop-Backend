import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { createSkillSchema, deleteSkillSchema, updateSkillSchema } from "./skills.validation";
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

router.patch(
	"/:id",
	auth(UserRole.ADMIN),
	validateRequest(updateSkillSchema),
	skillController.updateSkill,
);

router.delete(
	"/:id",
	auth(UserRole.ADMIN),
	validateRequest(deleteSkillSchema),
	skillController.deleteSkill,
);

export const skillRoute = router;