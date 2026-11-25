import { Request, Response } from "express";
import { userService } from "./users.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getMyProfileFromDB(req.user!.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile retrieved successfully",
    data: result,
  });
});

export const userController = {
    getMyProfile
}
