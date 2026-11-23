import { type Application } from "express";
import express from "express";
import { authRoute } from "./modules/auth/auth.route";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.use("/api/v1/auth", authRoute);

export default app;
