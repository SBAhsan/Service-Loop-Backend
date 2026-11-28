export interface ISetTechnicianSkillsPayload {
	skillIds: string[];
}

export interface ICreateTechnicianPayload {
	name: string;
	email: string;
	password: string;
	phone?: string;
	bio?: string;
}