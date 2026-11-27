import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import { ICreateCategoryPayload, IUpdateCategoryPayload } from "./categories.interface";

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

const getAllCategoriesFromDB = async () => {
  return prisma.serviceCategory.findMany({
    where: { deletedAt: null },
    select: categorySelect,
    orderBy: { name: "asc" },
  });
};

const updateCategoryInDB = async (
  id: string,
  payload: IUpdateCategoryPayload,
) => {
  const category = await prisma.serviceCategory.findFirst({
    where: { id, deletedAt: null },
  });

  if (!category) {
    throw new AppError(404, "Category not found", []);
  }

  const checkSkillExists = await prisma.skill.findFirst({
    where: { id, deletedAt: null },
  });

  if (!checkSkillExists) {
    throw new AppError(404, "Required skill not found", []);
  }

  const result = prisma.serviceCategory.update({
    where: { id },
    data: {
      name: payload.name?.trim(),
      description: payload.description,
      requiredSkillId: payload.requiredSkillId,
    },
    select: categorySelect,
  });

  return result;
};

export const categoryService = {
  createCategoryInDB,
  getAllCategoriesFromDB,
  updateCategoryInDB
};
