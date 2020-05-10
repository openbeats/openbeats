import { config } from "../config";
import Album from "../models/Album";

//Setting scope of albums admin can view
export const scopedAlbums = async (req, res, next) => {
	try {
		if ([2, 3].includes(req.user.admin.accessLevel)) {
			req.scopedAlbums = {};
		} else {
			req.scopedAlbums = { createdBy: req.user.id };
		}
		return next();
	} catch (error) {
		console.log(error);
		return res.json({
			status: false,
			data: error.message,
		});
	}
};

//checking permission if user can delete
export const canUpdateOrDeleteAlbum = async (req, res, next) => {
	try {
		const album = await Album.findById(req.params.id);
		if (!album) {
			throw new Error("No artist found with given Id.");
		}
		req.album = album;
		//Either if album is created by user or if admin in 2 or 3 access level
		if (req.user.id === req.album.createdBy.toString() || [2, 3].includes(req.user.admin.accessLevel)) return next();
		throw new Error("You do not have permission to perform this operation.");
	} catch (error) {
		return res.json({
			status: false,
			data: error.message,
		});
	}
};
