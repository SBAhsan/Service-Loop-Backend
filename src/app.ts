import type { Application } from "express";
import express from "express";
import { authRoute } from "./modules/auth/auth.route";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.use("/api/v1/auth", authRoute);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
