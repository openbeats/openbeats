import { config } from "../config";
import Artist from "../models/Artist";

export const canDeleteArtist = async (req, res, next) => {
	try {
		if ([2, 3].includes(req.user.admin.accessLevel)) {
			const artist = await Artist.findById(req.params.id);
			req.artist = artist;
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

export const canUpdateArtist = async (req, res, next) => {
	try {
		const artist = await Artist.findById(req.params.id);
		if (!artist) {
			throw new Error("No artist found with given Id.");
		}
		req.artist = artist;
		if (req.user.id === req.artist.createdBy.toString() || [2, 3].includes(req.user.admin.accessLevel)) return next();
		throw new Error("You do not have permission to perform this operation.");
	} catch (error) {
		return res.json({
			status: false,
			data: error.message,
		});
	}
};
