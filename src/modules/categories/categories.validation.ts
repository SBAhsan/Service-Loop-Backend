import z from "zod";
import { nonEmptyString } from "../../common/validationHelpers";

export const createCategorySchema = z.object({
	body: z.strictObject({
		name: nonEmptyString,
		description: nonEmptyString.optional(),
		requiredSkillId: z.uuid("Invalid skill id").optional(),
	}),
});

export const updateCategorySchema = z.object({
	params: z.object({ id: z.uuid("Invalid category id") }),
	body: z
		.strictObject({
			name: nonEmptyString.optional(),
			description: nonEmptyString.optional(),
			requiredSkillId: z.uuid("Invalid skill id").nullable().optional(),
		})
		.refine((body) => Object.keys(body).length > 0, {
			message: "Provide at least one field to update",
		}),
});

export const deleteCategorySchema = z.object({
	params: z.object({ id: z.uuid("Invalid category id") }),
});