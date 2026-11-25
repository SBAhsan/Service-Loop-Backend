import z from "zod";
import { nonEmptyString } from "../../common/validationHelpers";

export const updateProfileSchema = z.object({
	body: z
		.strictObject({
			name: nonEmptyString.optional(),
			phone: z
				.string()
				.regex(/^(\+8801|01)[3-9]\d{8}$/, "Invalid Bangladeshi phone number")
				.optional(),
			address: nonEmptyString.optional(),
			bio: nonEmptyString.optional(),
		})
		.refine((body) => Object.keys(body).length > 0, {
			message: "Provide at least one field to update",
		}),
});
