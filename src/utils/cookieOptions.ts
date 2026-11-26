import config from "../config";

export const cookieOptions = {
	httpOnly: true,
	secure: config.node_env === "production",
	sameSite: config.node_env === "production" ? ("none" as const) : ("lax" as const),
};