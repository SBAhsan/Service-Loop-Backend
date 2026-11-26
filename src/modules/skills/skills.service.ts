import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import { ISkillPayload } from "./skills.interface";

const createSkillInDB = async (payload: ISkillPayload) => {
  const name = payload.name.trim();

  const existing = await prisma.skill.findUnique({ where: { name } });

  if (existing && !existing.deletedAt) {
    throw new AppError(409, "A skill with this name already exists", []);
  }

  // biome-ignore lint/complexity/useOptionalChain: <explanation>
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

const getAllSkillsFromDB = async () => {

    const result = prisma.skill.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return result;
};

const updateSkillInDB = async (id: string, payload: ISkillPayload) => {
  const skill = await prisma.skill.findFirst({
    where: { id, deletedAt: null },
  });

  if (!skill) {
    throw new AppError(404, "Skill not found", []);
  }

  const result = prisma.skill.update({
    where: { id },
    data: { name: payload.name.trim() },
    select: { id: true, name: true },
  });

  return result;
};

const deleteSkillInDB = async (id: string) => {
	const skill = await prisma.skill.findFirst({
		where: { id, deletedAt: null },
	});

	if (!skill) {
		throw new AppError(404, "Skill not found", []);
	}

	const categoriesUsingSkill = await prisma.serviceCategory.count({
		where: { requiredSkillId: id, deletedAt: null },
	});

	if (categoriesUsingSkill > 0) {
		throw new AppError(
			409,
			"This skill is required by an active category. Change the category first",
			[],
		);
	}

	await prisma.skill.update({
		where: { id },
		data: { deletedAt: new Date() },
	});

	return null;
};

export const skillService = {
  createSkillInDB,
  getAllSkillsFromDB,
  updateSkillInDB,
  deleteSkillInDB
};
