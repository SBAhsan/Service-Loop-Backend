import z from "zod";
import { nonEmptyString } from "../../common/validationHelpers";

export const setTechnicianSkillsSchema = z.object({
	params: z.object({ id: z.uuid("Invalid technician id") }),
	body: z.strictObject({
		skillIds: z.array(z.uuid("Invalid skill id")).max(50),
	}),
});

export const createTechnicianSchema = z.object({
	body: z.strictObject({
		name: nonEmptyString,
		email: z.email("Invalid email"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		phone: z
			.string()
			.regex(/^(\+8801|01)[3-9]\d{8}$/, "Invalid Bangladeshi phone number")
			.optional(),
		bio: nonEmptyString.optional(),
	}),
});