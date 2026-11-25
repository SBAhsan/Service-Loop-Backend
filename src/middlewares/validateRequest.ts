import type { NextFunction, Request, Response } from "express";
import type z from "zod";

export const validateRequest = (schema: z.ZodType) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const parsed = (await schema.parseAsync({
				body: req.body,
				params: req.params,
				query: req.query,
			})) as { body: Request["body"] };

			req.body = parsed.body;
			next();
		} catch (error) {
			next(error);
		}
	};
};
