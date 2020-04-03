import express from "express";
import Album from "../models/Album";
import { check, body, validationResult } from "express-validator";
import { uniq } from "lodash";
import config from "config";
import axios from "axios";
import { Error } from "mongoose";
import SearchTag from "../models/SearchTag";
import Artist from "../models/Artist";

const router = express.Router();

//Set Base Url
const baseUrl = `${
	config.get("isDev") ? config.get("baseurl").dev : config.get("baseurl").prod
}`;

router.post(
	"/create",
	[
		check("name", "Name is required")
			.not()
			.isEmpty(),
		check("userId", "User Id is required.")
			.not()
			.isEmpty(),
		check("artistTags", "Please pass atleast one artist tag in array.")
			.if(body("artistTags").exists())
			.isArray()
			.not()
			.isEmpty(),
		check("searchTags", "Please pass atleast one search tag in array.")
			.if(body("searchTags").exists())
			.isArray()
			.not()
			.isEmpty(),
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

			const { name, artistTags, searchTags, userId, albumBy } = req.body;

			if (!name || !userId) {
				throw new Error("Pass name and  userId in request body.");
			}

			const newAlbum = {};
			newAlbum.name = name;
			newAlbum.createdBy = userId;
			newAlbum.updatedBy = userId;

			const album = new Album(newAlbum);
			await album.addDefultSearchTags();
			await album.save();

			if (albumBy) {
				album.addAlbumBy(albumBy);
			}

			if (artistTags) {
				await album.addfeaturingArtists(artistTags);
			}

			if (searchTags) {
				await album.addSearchTags(searchTags);
			}

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

router.get("/all", async (req, res) => {
	try {
		const albumAll = await Album.find(
			{},
			{
				_id: true,
				name: 1,
				thumbnail: 2,
				totalSongs: 3,
			},
		);
		if (!albumAll) {
			return res.json({
				status: false,
				data: "No albums found.",
			});
		}
		res.send({
			status: true,
			data: albumAll,
		});
	} catch (error) {
		console.log(error.message);
		res.send({
			status: false,
			data: error.message,
		});
	}
});

router.get("/:id", async (req, res) => {
	try {
		const album = await Album.findById(req.params.id);
		if (!album) {
			return res.json({
				status: false,
				data: "Album not found.",
			});
		}
		const songsDataFetchUrl = `${baseUrl}/getsongs`;
		const songIds = album.songs;
		const songs = (
			await axios.post(songsDataFetchUrl, {
				songIds,
			})
		).data.data;
		const tempData = {
			...album["_doc"],
			songs: [...songs],
		};
		res.send({
			status: true,
			data: tempData,
		});
	} catch (error) {
		console.log(error.message);
		res.send({
			status: false,
			data: error.message,
		});
	}
});

router.put(
	"/:id/addsongs",
	[
		check("userId", "User Id is required.")
			.not()
			.isEmpty(),
		check("songs", "Please pass array of song objects to add.")
			.isArray()
			.not()
			.isEmpty(),
	],
	async (req, res) => {
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

		const { userId, songs } = req.body;

		try {
			const album = await Album.findById(req.params.id);
			if (!album) {
				return res.json({
					status: false,
					data: "Album not found.",
				});
			}
			const addSongsCoreUrl = `${baseUrl}/addsongs`;
			const availableSongs = album.songs;
			const songIds = songs.map(song => song.videoId);
			let newSongsList = [...songIds, ...availableSongs];
			newSongsList = uniq(newSongsList);
			axios.post(addSongsCoreUrl, {
				songs: [...songs],
			});
			await album.updateOne({
				songs: newSongsList,
				updatedAt: Date.now(),
				updatedBy: userId,
				totalSongs: newSongsList.length,
				thumbnail: songs[0].thumbnail,
			});
			res.send({
				status: true,
				data: "Songs added successfully.",
			});
		} catch (error) {
			console.log(error);
			res.send({
				status: false,
				data: error.message,
			});
		}
	},
);

router.put(
	"/:id/deletesong",
	[
		check("userId", "User Id is required.")
			.not()
			.isEmpty(),
		check("songId", "Please pass on the song Id to delete.")
			.not()
			.isEmpty(),
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

			const { userId, songId } = req.body;

			await Album.findByIdAndUpdate(req.params.id, {
				$pull: {
					songs: songId,
				},
			});

			const album = await Album.findById(req.params.id);

			if (!album) {
				return res.json({
					status: false,
					data: "Album not found.",
				});
			}
			const lastSongId = album.songs.length
				? album.songs[album.songs.length - 1]
				: null;
			let newThumbnail = `https://openbeats.live/static/media/dummy_music_holder.a3d0de2e.jpg`;
			if (lastSongId !== null) {
				const songsCoreUrl = `${baseUrl}/getsong/${lastSongId}`;
				const newThumbData = (await axios.get(songsCoreUrl)).data;
				if (newThumbData.status) {
					newThumbnail = newThumbData.data.thumbnail;
				}
			}
			await album.updateOne({
				updatedAt: Date.now(),
				updatedBy: userId,
				totalSongs: album.songs.length,
				thumbnail: newThumbnail,
			});

			res.send({
				status: true,
				data: "Song has been deleted successfully",
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

router.put("/:id/deletesearchtag", async (req, res) => {
	try {
		const album = await Album.findById(req.params.id);

		if (!album) {
			return res.json({
				status: false,
				data: "Album not found.",
			});
		}
		const { searchTag, userId } = req.body;

		if (!searchTag || !userId) {
			return res.json({
				status: false,
				data: "Please pass both albumBy and userId in request body.",
			});
		}

		await Album.findByIdAndUpdate(req.params.id, {
			$pull: {
				searchTags: searchTag,
			},
		});

		await SearchTag.findByIdAndUpdate(searchTag, {
			$pull: {
				albumTags: req.params.id,
			},
		});

		await album.save();

		res.send({
			status: true,
			data: "Successfully removed the search tag.",
		});
	} catch (error) {
		res.send({
			status: false,
			data: error.message,
		});
	}
});

router.put("/:id/deleteartisttag", async (req, res) => {
	try {
		const album = await Album.findById(req.params.id);

		if (!album) {
			return res.json({
				status: false,
				data: "Album not found.",
			});
		}
		const { artistTag, userId } = req.body;

		if (!albumBy || !userId) {
			return res.json({
				status: false,
				data: "Please pass both albumBy and userId in request body.",
			});
		}
		album.updatedBy = userId;

		await Album.findByIdAndUpdate(req.params.id, {
			$pull: {
				featuringArtists: artistTag,
			},
		});

		await Artist.findByIdAndUpdate(artistTag, {
			$pull: {
				featuringAlbums: req.params.id,
			},
		});

		await album.save();

		res.send({
			status: true,
			data: "Successfully removed the artist tag from.",
		});
	} catch (error) {
		res.send({
			status: false,
			data: error.message,
		});
	}
});

router.put("/:id/deletealbumby", async (req, res) => {
	try {
		const album = await Album.findById(req.params.id);

		if (!album) {
			return res.json({
				status: false,
				data: "Album not found.",
			});
		}
		const { albumBy, userId } = req.body;

		if (!albumBy || !userId) {
			return res.json({
				status: false,
				data: "Please pass both albumBy and userId in request body.",
			});
		}
		album.updatedBy = userId;

		await Album.findByIdAndUpdate(req.params.id, {
			albumBy: null,
		});

		await Artist.findByIdAndUpdate(albumBy, {
			$pull: {
				releasedAlbums: req.params.id,
			},
		});

		await album.save();

		res.send({
			status: true,
			data: "Successfully removed the album's artist.",
		});
	} catch (error) {
		res.send({
			status: false,
			data: error.message,
		});
	}
});

router.put(
	"/:id",
	[
		check("name", "Name must not be empty.")
			.if(body("name").exists())
			.not()
			.isEmpty(),
		check("userId", "User Id is required.")
			.not()
			.isEmpty(),
		check("artistTags", "Please pass atleast one artist tag in array.")
			.if(body("artistTags").exists())
			.isArray()
			.not()
			.isEmpty(),
		check("searchTags", "Please pass atleast one search tag in array.")
			.if(body("searchTags").exists())
			.isArray()
			.not()
			.isEmpty(),
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
						.map(ele => `${ele.param} - ${ele.msg} `)
						.join("\n"),
				});
			}

			const { name, artistTags, searchTags, userId, albumBy } = req.body;

			album.updatedBy = userId;

			if (name) {
				album.name = name;
				await album.addDefultSearchTags();
			}
			await album.save();

			if (albumBy) {
				await album.addAlbumBy(albumBy);
			}

			if (artistTags) {
				await album.addfeaturingArtists(artistTags);
			}

			if (searchTags) {
				await album.addSearchTags(searchTags);
			}

			await album.save();
			res.send({
				status: true,
				data: album,
			});
		} catch (error) {
			res.send({
				status: false,
				data: error.message,
			});
		}
	},
);

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

export default router;
