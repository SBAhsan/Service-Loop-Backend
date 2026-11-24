import type { UserRole, UserStatus } from "../../../prisma/generated/prisma/enums";

export interface IUserRegisterPayload {
	name: string;
	email: string;
	password: string;
	role?: UserRole;
	status?: UserStatus;
}

export interface ILoginUser {
	email: string;
	password: string;
}

export interface IGoogleLoginPayload {
	idToken: string;
}
