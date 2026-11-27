import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import { ICreateCategoryPayload } from "./categories.interface";

const categorySelect = {
  id: true,
  name: true,
  description: true,
  requiredSkill: { select: { id: true, name: true } },
};

const createCategoryInDB = async (payload: ICreateCategoryPayload) => {
  const name = payload.name.trim();

  const checkSkillExists = await prisma.skill.findFirst({
    where: { id: payload.requiredSkillId, deletedAt: null },
  });

  if (!checkSkillExists) {
    throw new AppError(404, "Required skill not found", []);
  }

  const existing = await prisma.serviceCategory.findUnique({
    where: { name },
  });

  if (existing && !existing.deletedAt) {
    throw new AppError(409, "A category with this name already exists", []);
  }

  if (existing && existing.deletedAt) {
    return prisma.serviceCategory.update({
      where: { id: existing.id },
      data: {
        deletedAt: null,
        description: payload.description,
        requiredSkillId: payload.requiredSkillId ?? null,
      },
      select: categorySelect,
    });
  }

  const result = prisma.serviceCategory.create({
    data: {
      name,
      description: payload.description,
      requiredSkillId: payload.requiredSkillId,
    },
    select: categorySelect,
  });

  return result;
};

export const categoryService = {
    createCategoryInDB
}
