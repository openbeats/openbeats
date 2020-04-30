import jwt from "jsonwebtoken";
import { config } from "../config";
import Artist from "../models/Artist";

export const canDeleteArtist = async (req, res, next) => {
	//Get token from header
	const token = req.header("x-auth-token");
	try {
		if (!token) {
			throw new Error("No token, authorization denied");
		}
		const decoded = jwt.verify(token, config.jwtSecret);
		req.user = decoded.user;
		if (req.user.admin.status && [2, 3].includes(req.user.admin.accessLevel)) return next();
		throw new Error("You do not have permission to perform this operation.");
	} catch (error) {
		return res.json({
			status: false,
			data: error.message,
		});
	}
};

export const canUpdateArtist = async (req, res, next) => {
	//Get token from header
	const token = req.header("x-auth-token");
	try {
		if (!token) {
			throw new Error("No token, authorization denied");
		}
		const decoded = jwt.verify(token, config.jwtSecret);
		req.user = decoded.user;
		const artist = await Artist.findById(req.params.id);
		if (!artist) {
			throw new Error("No artist found with given Id.");
		}
		req.artist = artist;
		if (req.user.admin.status && (req.user.id === req.artist.createdBy.toString() || [2, 3].includes(req.user.admin.accessLevel))) return next();
		throw new Error("You do not have permission to perform this operation.");
	} catch (error) {
		return res.json({
			status: false,
			data: error.message,
		});
	}
};
