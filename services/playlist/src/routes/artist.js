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

const router = Router();

//artist creation
router.post("/create", async (req, res) => {
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
		});
		await artist.save();
		res.send({
			status: true,
			data: artist,
		});
	} catch (error) {
		console.log(error.message);
		res.send({
			status: false,
			data: error.message,
		});
	}
});

//Get artist by Id or startsWith
router.get(
	"/fetch",
	oneOf([check("tagId").exists(), check("startsWith").exists()]),
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json({
					status: false,
					data: "Please provide either artistId or startsWith as query params.",
				});
			}
			const {
				tagId,
				startsWith
			} = req.query;

			if (tagId) {
				const artist = await Artist.findById(tagId);
				return res.send({
					status: true,
					data: artist,
				});
			} else if (startsWith) {
				const artists = await Artist.find({
					name: {
						$regex: `^${startsWith}`,
						$options: "i",
					},
				}).limit(10);
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
			console.log(error.message);
			res.send({
				status: false,
				data: error.message,
			});
		}
	},
);

//Get all artist (page and limit query param is required)
router.get("/all", paginationMiddleware(Artist), async (req, res) => {
	try {
		if (res.pagnationError)
			throw new Error(res.pagnationError);
		res.send({
			status: true,
			data: res.paginatedResults,
		});
	} catch (error) {
		console.log(error.message);
		res.send({
			status: false,
			data: error.message,
		});
	}
});

//update artist
router.put("/:id", async (req, res) => {
	try {
		const artist = await Artist.findById(req.params.id);
		if (!artist) {
			throw new Error("No artist found with given Id.");
		}
		const {
			name,
			thumbnail
		} = req.body;
		if (!name) {
			throw new Error("Name is required.");
		}
		artist.name = name;
		if (thumbnail) {
			artist.thumbnail = thumbnail;
		}
		await artist.save();
		return res.send({
			status: true,
			data: artist,
		});
	} catch (error) {
		console.log(error.message);
		return res.send({
			status: false,
			data: error.message,
		});
	}
});

//delete artist
router.delete("/:id", async (req, res) => {
	try {
		await Artist.findByIdAndDelete(req.params.id);
		res.send({
			status: true,
			data: "Artist got deleted successfully.",
		});
	} catch (error) {
		console.log(error.message);
		res.send({
			status: false,
			data: error.message,
		});
	}
});

// fetch artist specific albums..
router.get("/:id/releases", async (req, res) => {
	try {
		const releasedAlbum = await Album.find({
			albumBy: req.params.id
		}, {
			_id: true,
			name: 1,
			thumbnail: 2,
			totalSongs: 3,
			albumBy: 4
		}).populate("albumBy");
		setTimeout(async () => {
			const artist = await Artist.findById(req.params.id);
			if (typeof (artist.popularityCount) === "number") {
				artist.popularityCount += 1;
			} else {
				artist.popularityCount = 1;
			}
			artist.save();
		}, 0);
		return res.send({
			status: true,
			data: releasedAlbum,
		});
	} catch (error) {
		console.log(error.message);
		res.send({
			status: false,
			data: error.message,
		});
	}
});

// fetch artist featuring albums..
router.get("/:id/featuring", async (req, res) => {
	try {
		const featuringAlbum = await Album.find({
			featuringArtists: {
				"$in": [req.params.id]
			}
		}, {
			_id: true,
			name: 1,
			thumbnail: 2,
			totalSongs: 3,
		});
		setTimeout(async () => {
			const artist = await Artist.findById(req.params.id);
			if (typeof (artist.popularityCount) === "number") {
				artist.popularityCount += 1;
			} else {
				artist.popularityCount = 1;
			}
			artist.save();
		}, 0);
		res.send({
			status: true,
			data: featuringAlbum,
		});
	} catch (error) {
		console.log(error.message);
		res.send({
			status: false,
			data: error.message,
		});
	}
});


export default router;