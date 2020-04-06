import express from "express";
import Album from "../models/Album";
import {
	check,
	body,
	validationResult
} from "express-validator";
import config from "config";
import axios from "axios";
import {
	Error
} from "mongoose";
import paginationMiddleware from "../config/paginationMiddleware"

const router = express.Router();

//Set Base Url
const baseUrl = `${
	config.get("isDev") ? config.get("baseurl").dev : config.get("baseurl").prod
}`;

// album creation
router.post(
	"/create",
	[
		check("name", "Name is required").not().isEmpty(),
		check("userId", "User Id is required.").not().isEmpty(),
		check("songs", "Please pass array of song objects to add.")
		.isArray()
		.not()
		.isEmpty(),
		check("featuringArtists", "Please pass atleast one artist tag in array.")
		.if(body("featuringArtists").exists())
		.isArray(),
		check("searchTags", "Please pass atleast one search tag in array.")
		.if(body("searchTags").exists())
		.isArray()
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.json({
					status: false,
					data: errors
						.array()
						.map((ele) => `${ele.param} - ${ele.msg} `)
						.join("\n"),
				});
			}

			const {
				name,
				featuringArtists,
				searchTags,
				userId,
				albumBy,
				songs
			} = req.body;

			if (!name || !userId || !songs) {
				throw new Error("Pass name, userId and songs in request body.");
			}

			const songIds = songs.map((song) => song.videoId);
			const newAlbum = {};
			newAlbum.name = name;
			newAlbum.createdBy = userId;
			newAlbum.updatedBy = userId;
			newAlbum.songs = songIds;
			newAlbum.totalSongs = songIds.length;
			newAlbum.thumbnail = songs[0].thumbnail;
			newAlbum.albumBy = albumBy;
			newAlbum.featuringArtists = featuringArtists;
			newAlbum.searchTags = searchTags;
			const addSongsCoreUrl = `${baseUrl}/addsongs`;
			axios.post(addSongsCoreUrl, {
				songs,
			});
			const album = new Album(newAlbum);
			await album.addDefultSearchTags();
			res.send({
				status: true,
				data: album,
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

//Get all albums
router.get("/all", paginationMiddleware(Album, {}, {
	_id: true,
	name: 1,
	thumbnail: 2,
	totalSongs: 3,
	createdAt: 4,
	createdBy: 5
}, [{
	path: 'createdBy',
	select: 'name'
}]), async (req, res) => {
	try {
		if (!res.paginatedResults) {
			let data = "No albums found...";
			if (res.pagnationError) {
				data = res.pagnationError;
			}
			throw new Error(data);
		}
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

// get specific data
router.get("/:id", async (req, res) => {
	try {
		let album = null;
		if (req.query.edit === "true") {
			album = await Album.findById(req.params.id)
				.populate("searchTags")
				.populate("featuringArtists")
				.populate("albumBy")
				.populate("songsList");
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
			songs: album["$$populatedVirtuals"]["songsList"]
		};

		res.send({
			status: true,
			data: fetchedAlbum,
		});
	} catch (error) {
		console.log(error.message);
		res.send({
			status: false,
			data: error.message,
		});
	}
});

// updates Album
router.put(
	"/:id",
	[
		check("name", "Name is required").not().isEmpty(),
		check("userId", "User Id is required.").not().isEmpty(),
		check("songs", "Please pass array of song objects to add.")
		.isArray()
		.not()
		.isEmpty(),
		check("featuringArtists", "Please pass atleast one artist tag in array.")
		.if(body("featuringArtists").exists())
		.isArray(),
		check("searchTags", "Please pass atleast one search tag in array.")
		.if(body("searchTags").exists())
		.isArray()
	],
	async (req, res) => {
		try {
			const album = await Album.findById(req.params.id);
			if (!album) {
				return res.json({
					status: false,
					data: "Album not found.",
				});
			}

			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json({
					status: false,
					data: errors
						.array()
						.map((ele) => `${ele.param} - ${ele.msg} `)
						.join("\n"),
				});
			}

			const {
				name,
				featuringArtists,
				songs,
				searchTags,
				userId,
				albumBy
			} = req.body;

			if (!name || !userId || !songs) {
				throw new Error("Pass name, userId and songs in request body.");
			}

			const songIds = songs.map((song) => song.videoId);
			album.name = name;
			album.updatedBy = userId;
			album.songs = songIds;
			album.totalSongs = songIds.length;
			album.thumbnail = songs[0].thumbnail;
			album.albumBy = albumBy;
			album.featuringArtists = featuringArtists;
			album.searchTags = searchTags;
			const addSongsCoreUrl = `${baseUrl}/addsongs`;
			axios.post(addSongsCoreUrl, {
				songs,
			});
			await album.save();
			res.send({
				status: true,
				data: album,
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

//delete album
router.delete("/:id", async (req, res) => {
	try {
		await Album.findByIdAndDelete(req.params.id);
		res.send({
			status: true,
			data: "Album got deleted successfully.",
		});
	} catch (error) {
		console.log(error.message);
		res.send({
			status: false,
			data: error.message,
		});
	}
});

//Find album related to searchtag
router.get("/:searchtag/findbysearchtag", async (req, res) => {
	try {
		const relatedAlbum = await Album.find({
			searchTags: {
				"$in": [req.params.searchtag]
			}
		}, {
			_id: true,
			name: 1,
			thumbnail: 2,
			totalSongs: 3,
		});
		res.send({
			status: true,
			data: relatedAlbum,
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