import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { categoryService } from "./categories.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createCategory = catchAsync(async (req: Request, res: Response) => {
	const result = await categoryService.createCategoryInDB(req.body);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Category created successfully",
		data: result,
	});
});


const getAllCategories = catchAsync(async (req: Request, res: Response) => {
	const result = await categoryService.getAllCategoriesFromDB();

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Categories retrieved successfully",
		data: result,
	});
});

export const categoryController = {
    createCategory,
    getAllCategories
}