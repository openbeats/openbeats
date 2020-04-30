import jwt from "jsonwebtoken";
import { config } from "../config";
import Album from "../models/Album";
export const scopedAlbums = async (req, res, next) => {
	//Get token from header
	const token = req.header("x-auth-token");
	try {
		if (!token) {
			throw new Error("No token, authorization denied");
		}
		const decoded = jwt.verify(token, config.jwtSecret);
		req.user = decoded.user;
		if (req.user.admin.status) {
			if ([2, 3].includes(req.user.admin.accessLevel)) {
				req.scopedAlbums = {};
			} else {
				req.scopedAlbums = { createdBy: req.user.id };
			}
			return next();
		}
		throw new Error("You do not have permission to perform this operation.");
	} catch (error) {
		return res.json({
			status: false,
			data: error.message,
		});
	}
};

export const canUpdateOrDeleteAlbum = async (req, res, next) => {
	//Get token from header
	const token = req.header("x-auth-token");
	try {
		if (!token) {
			throw new Error("No token, authorization denied");
		}
		const decoded = jwt.verify(token, config.jwtSecret);
		req.user = decoded.user;
		const album = await Album.findById(req.params.id);
		if (!album) {
			throw new Error("No artist found with given Id.");
		}
		req.album = album;
		if (req.user.admin.status && (req.user.id === req.album.createdBy.toString() || [2, 3].includes(req.user.admin.accessLevel))) return next();
		throw new Error("You do not have permission to perform this operation.");
	} catch (error) {
		return res.json({
			status: false,
			data: error.message,
		});
	}
};
