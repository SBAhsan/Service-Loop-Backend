import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";

const setTechnicianSkillsInDB = async (
	technicianId: string,
	skillIds: string[],
) => {
	const technician = await prisma.technicianProfile.findFirst({
		where: { id: technicianId, user: { deletedAt: null } },
	});

	if (!technician) {
		throw new AppError(404, "Technician not found", []);
	}

	const uniqueSkillIds = [...new Set(skillIds)];

	const foundSkills = await prisma.skill.count({
		where: { id: { in: uniqueSkillIds }, deletedAt: null },
	});

	if (foundSkills !== uniqueSkillIds.length) {
		throw new AppError(400, "One or more skills do not exist", []);
	}

	await prisma.$transaction(async (tx) => {
		await tx.technicianSkill.deleteMany({ where: { technicianId } });

		if (uniqueSkillIds.length > 0) {
			await tx.technicianSkill.createMany({
				data: uniqueSkillIds.map((skillId) => ({ technicianId, skillId })),
			});
		}
	});

	return prisma.technicianProfile.findUnique({
		where: { id: technicianId },
		select: {
			id: true,
			skills: { select: { skill: { select: { id: true, name: true } } } },
		},
	});
};

export const adminService = {
	setTechnicianSkillsInDB,
};