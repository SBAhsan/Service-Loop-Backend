import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import { ISkillPayload } from "./skills.interface";

const createSkillInDB = async (payload: ISkillPayload) => {
	const name = payload.name.trim();

	const existing = await prisma.skill.findUnique({ where: { name } });

	if (existing && !existing.deletedAt) {
		throw new AppError(409, "A skill with this name already exists", []);
	}

	if (existing && existing.deletedAt) {
		return prisma.skill.update({
			where: { id: existing.id },
			data: { deletedAt: null },
			select: { id: true, name: true },
		});
	}

    const result = prisma.skill.create({
		data: { name },
		select: { id: true, name: true },
	});

	return result;
};

export const skillService = {
    createSkillInDB
}