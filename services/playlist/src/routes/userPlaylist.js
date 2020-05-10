import express from "express";
import UserPlaylist from "../models/UserPlaylist";
import axios from "axios";
import {
	uniq
} from "lodash";
import {
	config
} from "../config";
import auth from "../permissions/auth";

const router = express.Router();

//Set Base Url
const baseUrl = `${config.isDev ? config.baseurl.dev : config.baseurl.prod}`;

// create empty Playlist
router.post("/create", auth, async (req, res) => {
	try {
		const {
			name
		} = req.body;
		const userPlaylist = new UserPlaylist({
			name,
			createdBy: req.user.id,
		});
		const playlistData = await userPlaylist.save();
		res.send({
			status: true,
			data: playlistData,
		});
	} catch (error) {
		console.error(error.message);
		res.send({
			status: false,
			data: error.toString(),
		});
	}
});

// add songs into Playlist
router.post("/addsongs", auth, async (req, res) => {
	try {
		const {
			songs,
			playlistId
		} = req.body;
		const playlist = await UserPlaylist.findOne({
			_id: playlistId,
			createdBy: req.user.id,
		});
		if (!playlist) {
			throw new Error("Playlist can't be found...");
		}
		const addSongsCoreUrl = `${baseUrl}/addsongs`;
		if (playlist && songs.length) {
			const availableSongs = playlist.songs;
			const songIds = songs.map(song => song.videoId);
			let newSongsList = [...songIds, ...availableSongs];
			newSongsList = uniq(newSongsList);
			axios.post(addSongsCoreUrl, {
				songs: [...songs],
			});
			const updateObj = {
				updatedAt: Date.now(),
				totalSongs: newSongsList.length,
				thumbnail: songs[0].thumbnail,
				songs: newSongsList,
			};
			await playlist.updateOne(updateObj);
			res.send({
				status: true,
				data: "songs successfully added!",
			});
		} else {
			throw new Error("something went wrong!");
		}
	} catch (error) {
		console.error(error.message);
		res.send({
			status: false,
			data: error.message,
		});
	}
});

// get all playlist metadata
router.get("/getallplaylistmetadata", auth, async (req, res) => {
	try {
		const metaData = await UserPlaylist.find({
			createdBy: req.user.id,
		}, {
			_id: true,
			name: 1,
			thumbnail: 2,
			totalSongs: 3,
		}).sort({
			_id: -1,
		});
		res.send({
			status: true,
			data: metaData,
		});
	} catch (error) {
		console.error(error.message);
		res.send({
			status: false,
			data: error.toString(),
		});
	}
});

// get user playlist -  yet to implement song playlist
router.get("/getplaylist/:id", auth, async (req, res) => {
	try {
		const playlistId = req.params.id;
		const data = await UserPlaylist.findOne({
			_id: playlistId,
			createdBy: req.user.id,
		}).populate("songsList");
		let fetchedAlbum = {
			...data["_doc"],
			songs: data["$$populatedVirtuals"]["songsList"],
		};
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

// delete songs from playlist
router.post("/deletesong", auth, async (req, res) => {
	try {
		const {
			playlistId,
			songId
		} = req.body;
		await UserPlaylist.findOneAndUpdate({
			_id: playlistId,
			createdBy: req.user.id,
		}, {
			$pull: {
				songs: songId,
			},
		});
		const playlist = await UserPlaylist.findOne({
			_id: playlistId,
		});
		const lastSongId = playlist.songs.length ? playlist.songs[playlist.songs.length - 1] : null;
		let newThumbnail = `https://openbeats.live/static/media/dummy_music_holder.a3d0de2e.jpg`;
		if (lastSongId !== null) {
			const songsCoreUrl = `${baseUrl}/getsong/${lastSongId}`;
			const newThumbData = (await axios.get(songsCoreUrl)).data;
			if (newThumbData.status) {
				newThumbnail = newThumbData.data.thumbnail;
			}
		}
		await playlist.updateOne({
			updatedAt: Date.now(),
			totalSongs: playlist.songs.length,
			thumbnail: newThumbnail,
		});

		res.send({
			status: true,
			data: "Song has been deleted successfully",
		});
	} catch (error) {
		console.error(error.message);
		res.send({
			status: false,
			data: error.toString(),
		});
	}
});

// update name of the playlist
router.post("/updatename", auth, async (req, res) => {
	try {
		const {
			name,
			playlistId
		} = req.body;
		const playlist = await UserPlaylist.findOne({
			_id: playlistId,
			createdBy: req.user.id,
		});
		if (!playlist) {
			throw new Error("Playlist can't be found...");
		}
		await playlist.updateOne({
			name,
			updatedAt: Date.now(),
		});

		res.send({
			status: true,
			data: "Playlist name changed successfully!",
		});
	} catch (error) {
		console.error(error.message);
		res.send({
			status: false,
			data: error.toString(),
		});
	}
});

//delete playlist
router.get("/delete/:id", auth, async (req, res) => {
	try {
		const playlistId = req.params.id;
		const playlist = await UserPlaylist.findOne({
			_id: playlistId,
			createdBy: req.user.id,
		});
		if (!playlist) {
			throw new Error("Playlist can't be found...");
		}
		await playlist.deleteOne();
		res.send({
			status: true,
			data: "playlist deleted successfully!",
		});
	} catch (error) {
		console.error(error.message);
		res.send({
			status: false,
			data: error.toString(),
		});
	}
});

//Search by Name
router.get("/fetchByName", async (req, res) => {
	try {
		const {
			query
		} = req.query;
		const userPlaylists = await UserPlaylist.find({
			$text: {
				$search: `${query}`,
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
		return res.send({
			status: true,
			data: userPlaylists,
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