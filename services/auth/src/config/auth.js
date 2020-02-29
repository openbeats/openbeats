import jwt from "jsonwebtoken";
import config from "config";

export default (req, res, next) => {
	//Get token from header
	const token = req.header("x-auth-token");

	if (!token) {
		return res.json({
			status: false,
			data: "No token, authorization denied"
		});
	}

	try {
		const decoded = jwt.verify(token, config.get("jwtSecret"));
		req.user = decoded.user;
		next();
	} catch (error) {
		res.json({
			status: false,
			data: "Token is not valid"
		});
	}
};