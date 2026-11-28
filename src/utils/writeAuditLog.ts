import { prisma } from "../lib/prisma";
import { Prisma } from "../../prisma/generated/prisma/client";

type TAuditLogInput = {
	actorId?: string | null;
	action: string;
	entityType: string;
	entityId: string;
	before?: Prisma.InputJsonValue;
	after?: Prisma.InputJsonValue;
};

export const writeAuditLog = async (
	data: TAuditLogInput,
	tx?: Prisma.TransactionClient,
) => {
	const client = tx ?? prisma;

	await client.auditLog.create({ data });
};