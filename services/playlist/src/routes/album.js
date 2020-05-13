import express from "express";
import Album from "../models/Album";
import {
	check,
	oneOf,
	body,
	validationResult
} from "express-validator";
import {
	config
} from "../config";
import axios from "axios";
import {
	Error
} from "mongoose";
import paginationMiddleware from "../config/paginationMiddleware";
import {
	isAdmin,
	canUpdateOrDeleteAlbum,
	scopedAlbums
} from "../permissions";

const router = express.Router();

//Set Base Url
const baseUrl = `${config.isDev ? config.baseurl.dev : config.baseurl.prod}`;

// album creation
router.post(
	"/create",
	[
		isAdmin,
		[
			check("name", "Name is required").not().isEmpty(),
			check("songs", "Please pass array of song objects to add.").isArray().not().isEmpty(),
			oneOf([check("featuringArtists").exists().notEmpty(), check("albumBy").exists().notEmpty()]),
			check("searchVals", "Please pass atleast one search tag in array.")
			.isArray()
			.custom(value => value.length > 0),
		],
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json({
					status: false,
					data: errors
						.array()
						.map(ele => `${ele.param} - ${ele.msg} `)
						.join("\n"),
				});
			}
			const {
				name,
				featuringArtists,
				searchTags,
				albumBy,
				songs,
				searchVals,
				language,
				emotion,
				isCustom
			} = req.body;

			if (!name || !songs) {
				throw new Error("Pass name, userId and songs in request body.");
			}

			const songIds = songs.map(song => song.videoId);
			const newAlbum = {};
			newAlbum.name = name;
			newAlbum.createdBy = req.user.id;
			newAlbum.updatedBy = req.user.id;
			newAlbum.songs = songIds;
			newAlbum.totalSongs = songIds.length;
			newAlbum.thumbnail = songs[0].thumbnail;
			newAlbum.albumBy = albumBy;
			newAlbum.featuringArtists = featuringArtists;
			newAlbum.searchTags = searchTags;
			newAlbum.searchVals = searchVals;
			newAlbum.languageArr = language;
			newAlbum.emotion = emotion;
			newAlbum.isCustom = isCustom;
			const addSongsCoreUrl = `${baseUrl}/addsongs`;
			axios
				.post(addSongsCoreUrl, {
					songs,
				})
				.catch(err => console.log(err.message));
			const album = new Album(newAlbum);
			await album.save();
			res.send({
				status: true,
				data: album,
			});
		} catch (error) {
			console.error(error);
			res.send({
				status: false,
				data: error.message,
			});
		}
	}
);

// update Album
router.put(
	"/:id",
	[
		isAdmin,
		canUpdateOrDeleteAlbum,
		[
			check("name", "Name is required").not().isEmpty(),
			check("songs", "Please pass array of song objects to add.").isArray().not().isEmpty(),
			check("featuringArtists", "Please pass atleast one artist tag in array.").if(body("featuringArtists").exists()).isArray(),
			oneOf([check("featuringArtists").exists().notEmpty(), check("albumBy").exists().notEmpty()]),
			check("searchVals", "Please pass atleast one search tag in array.")
			.isArray()
			.custom(value => value.length > 0),
		],
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json({
					status: false,
					data: errors
						.array()
						.map(ele => `${ele.param} - ${ele.msg} `)
						.join("\n"),
				});
			}
			const {
				name,
				featuringArtists,
				songs,
				searchTags,
				albumBy,
				searchVals,
				language,
				emotion,
				isCustom
			} = req.body;
			if (!name || !songs) {
				throw new Error("Pass name, userId and songs in request body.");
			}
			const songIds = songs.map(song => song.videoId);
			req.album.name = name;
			req.album.updatedBy = req.user.id;
			req.album.songs = songIds;
			req.album.totalSongs = songIds.length;
			req.album.thumbnail = songs[0].thumbnail;
			req.album.albumBy = albumBy;
			req.album.featuringArtists = featuringArtists;
			req.album.searchTags = searchTags;
			req.album.searchVals = searchVals;
			req.album.languageArr = language;
			req.album.emotion = emotion;
			req.album.isCustom = isCustom;
			const addSongsCoreUrl = `${baseUrl}/addsongs`;
			axios.post(addSongsCoreUrl, {
				songs,
			});
			await req.album.save();
			res.send({
				status: true,
				data: req.album,
			});
		} catch (error) {
			console.error(error.message);
			res.send({
				status: false,
				data: error.message,
			});
		}
	}
);

//Get all for captain app
router.get(
	"/captain/all",
	isAdmin,
	scopedAlbums,
	paginationMiddleware(
		Album, {}, {
			_id: true,
			name: 1,
			thumbnail: 2,
			totalSongs: 3,
			createdAt: 4,
			createdBy: 5,
		},
		[{
			path: "createdBy",
			select: "name",
		}, ]
	),
	async (req, res) => {
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
	}
);

//Get all for client app
router.get(
	"/all",
	paginationMiddleware(
		Album, {}, {
			_id: true,
			name: 1,
			thumbnail: 2,
			totalSongs: 3,
			createdAt: 4,
			createdBy: 5,
		},
		[{
			path: "createdBy",
			select: "name",
		}]
	),
	async (req, res) => {
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
	}
);

//Find album related to searchtag
router.get("/findbytag", [check("query", "'query' param is required.").not().isEmpty()], async (req, res) => {
	console.log(req.query.query);
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.json({
				status: false,
				data: errors
					.array()
					.map(ele => `${ele.param} - ${ele.msg} `)
					.join("\n"),
			});
		}
		const relatedAlbum = await Album.find({
			$text: {
				$search: `${req.query.query}`,
				$caseSensitive: false,
			},
		}, {
			_id: true,
			name: 1,
			thumbnail: 2,
			totalSongs: 3,
			score: {
				$meta: "textScore",
			},
		}).sort({
			score: {
				$meta: "textScore"
			}
		});
		res.send({
			status: true,
			data: relatedAlbum,
		});
	} catch (error) {
		console.error(error.message);
		res.send({
			status: false,
			data: error.message,
		});
	}
});

// get specific album
router.get("/:id", async (req, res) => {
	try {
		let album = null;
		if (req.query.edit === "true") {
			album = await Album.findById(req.params.id).populate("searchTags").populate("featuringArtists").populate("albumBy").populate("songsList");
		} else {
			album = await Album.findById(req.params.id).populate("songsList");
		}
		if (!album) {
			return res.json({
				status: false,
				data: "Album not found.",
			});
		}

		let fetchedAlbum = {
			...album["_doc"],
			songs: album["$$populatedVirtuals"]["songsList"],
		};
		setTimeout(() => {
			if (typeof album.popularityCount === "number") {
				album.popularityCount += 1;
			} else {
				album.popularityCount = 1;
			}
			album.save();
		}, 0);

		res.send({
			status: true,
			data: fetchedAlbum,
		});
	} catch (error) {
		console.error(error.message);
		res.send({
			status: false,
			data: error.message,
		});
	}
});

//delete album
router.delete("/:id", isAdmin, canUpdateOrDeleteAlbum, async (req, res) => {
	try {
		await Album.findByIdAndDelete(req.params.id);
		res.send({
			status: true,
			data: "Album got deleted successfully.",
		});
	} catch (error) {
		console.error(error.message);
		res.send({
			status: false,
			data: error.message,
		});
	}
});

export default router;