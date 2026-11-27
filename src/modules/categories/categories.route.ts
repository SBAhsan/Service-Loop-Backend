import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCategorySchema, deleteCategorySchema, updateCategorySchema } from "./categories.validation";
import { categoryController } from "./categories.controller";

const router = Router();

router.get("/", categoryController.getAllCategories);

router.post(
	"/",
	auth(UserRole.ADMIN),
	validateRequest(createCategorySchema),
	categoryController.createCategory,
);

router.patch(
	"/:id",
	auth(UserRole.ADMIN),
	validateRequest(updateCategorySchema),
	categoryController.updateCategory,
);

router.delete(
	"/:id",
	auth(UserRole.ADMIN),
	validateRequest(deleteCategorySchema),
	categoryController.deleteCategory,
);


export const categoryRoute = router;