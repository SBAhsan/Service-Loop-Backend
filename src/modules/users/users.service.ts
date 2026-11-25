import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";

const getMyProfileFromDB = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    omit: { password: true, googleId: true, deletedAt: true },
    include: {
      customerProfile: {
        select: { id: true, address: true },
      },
      technicianProfile: {
        select: {
          id: true,
          bio: true,
          isAvailable: true,
          skills: {
            select: { skill: { select: { id: true, name: true } } },
          },
        },
      },
    },
  });

  if (!user) {
    throw new AppError(404, "User not found", []);
  }

  return user;
};

export const userService = {
    getMyProfileFromDB
}
