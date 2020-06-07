import Artist from "../models/Artist";
import Album from "../models/Album";
import {
	Router
} from "express";
import {
	check,
	oneOf,
	validationResult
} from "express-validator";
import paginationMiddleware from "../config/paginationMiddleware";
import setFindQuery from "../config/setFindQuery";
import {
	saveAsserts,
	deleteAssert
} from "../core/digitalOceanSpaces";
import {
	isAdmin,
	canDeleteArtist,
	canUpdateArtist
} from "../permissions";

const router = Router();

//artist creation
router.post("/create", isAdmin, async (req, res) => {
	try {
		const {
			name,
			thumbnail
		} = req.body;
		if (!name) {
			throw new Error("name is required.");
		}
		const artist = new Artist({
			name,
			thumbnail,
			createdBy: req.user.id,
		});
		await artist.save();
		saveAsserts("artists", artist._id, thumbnail, Artist, "thumbnail");
		res.send({
			status: true,
			data: artist,
		});
	} catch (error) {
		console.error(error.message);
		res.send({
			status: false,
			data: error.message,
		});
	}
});

//Get artist by Id or startsWith
router.get("/fetch", oneOf([check("tagId").exists(), check("query").exists()]), async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.json({
				status: false,
				data: "Please provide either artistId or query as query params.",
			});
		}
		const {
			tagId,
			query
		} = req.query;

		if (tagId) {
			const artist = await Artist.findById(tagId);
			return res.send({
				status: true,
				data: artist,
			});
		} else if (query) {
			const artists = await Artist.find({
				$text: {
					$search: `${query}`,
					$caseSensitive: false,
				},
			}, {
				score: {
					$meta: "textScore",
				},
			}).sort({
				score: {
					$meta: "textScore"
				}
			});
			return res.send({
				status: true,
				data: artists,
			});
		}
		return res.send({
			status: false,
			data: [],
		});
	} catch (error) {
		console.error(error.message);
		res.send({
			status: false,
			data: error.message,
		});
	}
});

router.get("/suggest", async (req, res) => {
	try {
		const {
			query
		} = req.query;
		if (query) {
			const artists = await Artist.find({
				name: {
					$regex: `${query}`,
					$options: `i`
				}
			}).limit(5).lean();
			return res.send({
				status: true,
				data: artists,
			});
		} else {
			throw new Error("Please give a valid tag...");
		}
	} catch (error) {
		console.error(error.message);
		res.send({
			status: false,
			data: error.message,
		});
	}
});

//Get all artist (page and limit query param is required)
router.get("/all", paginationMiddleware(Artist), async (req, res) => {
	try {
		if (res.pagnationError) throw new Error(res.pagnationError);
		res.send({
			status: true,
			data: res.paginatedResults,
		});
	} catch (error) {
		console.error(error.message);
		res.send({
			status: false,
			data: error.message,
		});
	}
});

//update artist
router.put("/:id", isAdmin, canUpdateArtist, async (req, res) => {
	try {
		const {
			name,
			thumbnail
		} = req.body;
		if (!name || !thumbnail) {
			throw new Error("Name is required.");
		}
		req.artist.name = name;
		req.artist.thumbnail = thumbnail;
		saveAsserts("artists", req.artist._id, thumbnail, Artist, "thumbnail");
		req.artist.updatedBy = req.user.id;
		await req.artist.save();
		return res.send({
			status: true,
			data: req.artist,
		});
	} catch (error) {
		console.error(error.message);
		return res.send({
			status: false,
			data: error.message,
		});
	}
});

//delete artist
router.delete("/:id", isAdmin, canDeleteArtist, async (req, res) => {
	try {
		deleteAssert(req.artist.thumbnail);
		await Artist.deleteOne({
			_id: req.artist._id
		});
		res.send({
			status: true,
			data: "Artist got deleted successfully.",
		});
	} catch (error) {
		console.error(error.message);
		return res.send({
			status: false,
			data: error.message,
		});
	}
});

// fetch artist specific albums..
router.get("/:id/releases", setFindQuery("albumBy", "id"), paginationMiddleware(Album, {}, {
	_id: true,
	name: 1,
	thumbnail: 2,
	totalSongs: 3,
	createdAt: 4,
	albumBy: 4,
}), async (req, res) => {
	try {
		setTimeout(async () => {
			const artist = await Artist.findById(req.params.id);
			if (artist) {
				if (typeof artist.popularityCount === "number") {
					artist.popularityCount += 1;
				} else {
					artist.popularityCount = 1;
				}
				artist.save();
			}
		}, 0);
		if (res.pagnationError) throw new Error(res.pagnationError);
		return res.send({
			status: true,
			data: res.paginatedResults,
		});
	} catch (error) {
		console.error(error.message);
		return res.send({
			status: false,
			data: error.message,
		});
	}
});

// fetch artist featuring albums..
router.get("/:id/featuring", setFindQuery("featuringArtists", "id", "$in"), paginationMiddleware(Album, {}, {
	_id: true,
	name: 1,
	thumbnail: 2,
	createdAt: 4,
	totalSongs: 3,
}), async (req, res) => {
	try {
		setTimeout(async () => {
			const artist = await Artist.findById(req.params.id);
			if (artist) {
				if (typeof artist.popularityCount === "number") {
					artist.popularityCount += 1;
				} else {
					artist.popularityCount = 1;
				}
				artist.save();
			}
		}, 0);
		if (res.pagnationError) throw new Error(res.pagnationError);
		return res.send({
			status: true,
			data: res.paginatedResults,
		});
	} catch (error) {
		console.error(error.message);
		return res.send({
			status: false,
			data: error.message,
		});
	}
});

export default router;