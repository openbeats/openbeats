import jwt from "jsonwebtoken";
import config from "config";
import fetch from "node-fetch";

export default async (req, res, next) => {
	//Get token from header
	const token = req.header("x-auth-token");

	if (!token) {
		return next();
	}
	try {
		const decoded = jwt.verify(token, config.get("jwtSecret"));
		const userId = decoded.user.id;
		const videoId = req.params.id;
		const info = req.query.info;
		let baseUrl;
		if (config.get("isDev")) {
			baseUrl = config.get("authbaseurl").dev;
		} else {
			baseUrl = config.get("authbaseurl").production;
		}

		const body = {
			userId,
			videoId,
			info
		};

		const response = await (await fetch(baseUrl + "/metadata/recentlyplayed", {
			method: 'post',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json'
			},
		})).json()
		console.log(response.status);
		next();
	} catch (error) {
		console.error(error.message);
		return next();
	}
};