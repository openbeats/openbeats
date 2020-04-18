import jwt from "jsonwebtoken";
import config from "config";
import fetch from "node-fetch";

export default async (req, res, next) => {
	//Get token from header
	const token = req.header("x-auth-token");
	const info = req.query.info;
	try {
		if (token) {
			const decoded = jwt.verify(token, config.get("jwtSecret"));
			const userId = decoded.user.id;
			const videoId = req.params.id;
			let baseUrl;
			if (config.get("isDev")) {
				baseUrl = config.get("authbaseurl").dev;
			} else {
				baseUrl = config.get("authbaseurl").prod;
			}
			const body = {
				userId,
				videoId,
			};
			fetch(baseUrl + "/metadata/recentlyplayed", {
				method: "post",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			});
		}
		if (info) {
			const song = JSON.parse(Buffer.from(info, "base64").toString());
			req.song = song;
		}
		return next();
	} catch (error) {
		console.error(error.message);
		return next();
	}
};