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

export const skillController = {
    createSkill
}