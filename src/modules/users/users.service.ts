import { UserRole } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import type { IUpdateProfilePayload } from "./users.interface";

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

const updateMyProfileInDB = async (
	userId: string,
	role: UserRole,
	payload: IUpdateProfilePayload,
) => {
	const { name, phone, address, bio } = payload;

	if (address !== undefined && role !== UserRole.CUSTOMER) {
		throw new AppError(400, "Only customers can set an address", []);
	}

	if (bio !== undefined && role !== UserRole.TECHNICIAN) {
		throw new AppError(400, "Only technicians can set a bio", []);
	}

	await prisma.$transaction(async (tx) => {
		await tx.user.update({
			where: { id: userId },
			data: { name, phone },
		});

		if (address !== undefined) {
			await tx.customerProfile.update({
				where: { userId },
				data: { address },
			});
		}

		if (bio !== undefined) {
			await tx.technicianProfile.update({
				where: { userId },
				data: { bio },
			});
		}
	});

	return getMyProfileFromDB(userId);
};

export const userService = {
	getMyProfileFromDB,
	updateMyProfileInDB,
};
