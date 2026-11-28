import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const setTechnicianSkills = catchAsync(async (req: Request, res: Response) => {
	const result = await adminService.setTechnicianSkillsInDB(
		req.params.id as string,
		req.body.skillIds,
	);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Technician skills updated successfully",
		data: result,
	});
});

const createTechnician = catchAsync(async (req: Request, res: Response) => {
	const result = await adminService.createTechnicianInDB(req.body, req.user!.id);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Technician created successfully",
		data: result,
	});
});

export const adminController = {
	setTechnicianSkills,
    createTechnician
};