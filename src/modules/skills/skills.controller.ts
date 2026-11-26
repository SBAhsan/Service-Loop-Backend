import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { skillService } from "./skills.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createSkill = catchAsync(async (req: Request, res: Response) => {
	const result = await skillService.createSkillInDB(req.body);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Skill created successfully",
		data: result,
	});
});

const getAllSkills = catchAsync(async (req: Request, res: Response) => {
	const result = await skillService.getAllSkillsFromDB();

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Skills retrieved successfully",
		data: result,
	});
});

const updateSkill = catchAsync(async (req: Request, res: Response) => {
	const result = await skillService.updateSkillInDB(
		req.params.id as string,
		req.body,
	);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Skill updated successfully",
		data: result,
	});
});

export const skillController = {
    createSkill,
    getAllSkills,
    updateSkill
}