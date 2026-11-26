import z from "zod";
import { nonEmptyString } from "../../common/validationHelpers";

export const createSkillSchema = z.object({
	body: z.strictObject({
		name: nonEmptyString,
	}),
});

export const updateSkillSchema = z.object({
	params: z.object({ id: z.uuid("Invalid skill id") }),
	body: z.strictObject({
		name: nonEmptyString,
	}),
});

export const deleteSkillSchema = z.object({
	params: z.object({ id: z.uuid("Invalid skill id") }),
});