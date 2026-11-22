import { type Application } from "express";
import express from "express";
import { authRoute } from "./modules/auth/auth.route";

const app: Application = express();

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.use("/api/v1", authRoute);

export default app;
