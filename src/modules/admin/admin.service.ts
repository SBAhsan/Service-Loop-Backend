import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import { ICreateTechnicianPayload } from "./admin.interface";
import config from "../../config";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { writeAuditLog } from "../../utils/writeAuditLog";

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

const createTechnicianInDB = async (
	payload: ICreateTechnicianPayload,
	adminId: string,
) => {
	const email = payload.email.toLowerCase();

	const existingUser = await prisma.user.findUnique({ where: { email } });

	if (existingUser) {
		throw new AppError(409, "A user with this email already exists", []);
	}

	const hashedPassword = await bcrypt.hash(
		payload.password,
		Number(config.bcrypt_salt_rounds),
	);

	const result = await prisma.$transaction(async (tx) => {
		const user = await tx.user.create({
			data: {
				name: payload.name,
				email,
				password: hashedPassword,
				phone: payload.phone,
				role: UserRole.TECHNICIAN,
				technicianProfile: {
					create: { bio: payload.bio },
				},
			},
			omit: { password: true, googleId: true, deletedAt: true },
			include: {
				technicianProfile: { select: { id: true, bio: true, isAvailable: true } },
			},
		});

		await writeAuditLog(
			{
				actorId: adminId,
				action: "TECHNICIAN_CREATED",
				entityType: "User",
				entityId: user.id,
				after: { name: user.name, email: user.email, role: user.role },
			},
			tx,
		);

		return user;
	});

	return result;
};


export const adminService = {
	setTechnicianSkillsInDB,
    createTechnicianInDB
};