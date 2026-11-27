export interface ICreateCategoryPayload {
	name: string;
	description?: string;
	requiredSkillId?: string;
}

export interface IUpdateCategoryPayload {
	name?: string;
	description?: string;
	requiredSkillId?: string | null;
}