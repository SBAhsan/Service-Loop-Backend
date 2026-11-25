import type { Request, Response } from "express";
import { userService } from "./users.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type { UserRole } from "../../../prisma/generated/prisma/enums";

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
	const result = await userService.getMyProfileFromDB(req.user!.id);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Profile retrieved successfully",
		data: result,
	});
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user?.id as string;
	const userRole = req.user?.role as UserRole;
	const payload = req.body;

	const result = await userService.updateMyProfileInDB(
		userId,
		userRole,
		payload,
	);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Profile updated successfully",
		data: result,
	});
});

export const userController = {
	getMyProfile,
	updateMyProfile,
};
