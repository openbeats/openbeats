import jwt from "jsonwebtoken";
import { config } from "../config";

export default async (req, res, next) => {
	//Get token from header
	const token = req.header("x-auth-token");
	try {
		if (!token) {
			throw new Error("No token, authorization denied");
		}
		const decoded = jwt.verify(token, config.jwtSecret);
		req.user = decoded.user;
		if (req.user.admin.status && req.user.admin.accessLevel) return next();
		throw new Error("You do not have permission to perform this operation.");
	} catch (error) {
		return res.json({
			status: false,
			data: error.message,
		});
	}
};
