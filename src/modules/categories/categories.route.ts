import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCategorySchema } from "./categories.validation";
import { categoryController } from "./categories.controller";

const router = Router();

router.get("/", categoryController.getAllCategories);

router.post(
	"/",
	auth(UserRole.ADMIN),
	validateRequest(createCategorySchema),
	categoryController.createCategory,
);

export const categoryRoute = router;