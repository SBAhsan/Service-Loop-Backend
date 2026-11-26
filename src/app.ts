import type { Application } from "express";
import express from "express";
import { authRoute } from "./modules/auth/auth.route";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import helmet from "helmet";
import cors from "cors";
import config from "./config";
import { authLimiter, generalLimiter } from "./middlewares/rateLimiter";
import { userRoute } from "./modules/users/users.route";
import { skillRoute } from "./modules/skills/skills.route";

const app: Application = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(
	cors({
		origin: config.cors_origin?.split(",") ?? false,
		credentials: true,
	}),
);
app.use(generalLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.use("/api/v1/auth", authLimiter, authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/skills", skillRoute);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
