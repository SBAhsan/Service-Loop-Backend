import z from "zod";

export const setTechnicianSkillsSchema = z.object({
	params: z.object({ id: z.uuid("Invalid technician id") }),
	body: z.strictObject({
		skillIds: z.array(z.uuid("Invalid skill id")).max(50),
	}),
});