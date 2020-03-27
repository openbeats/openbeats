import express from "express";
import UserPlaylist from "../models/UserPlaylist";
import axios from "axios";
import {
	uniq
} from "lodash";
import config from "config";

const router = express.Router();

// create empty Playlist
router.post("/create", async (req, res) => {
	try {
		const {
			name,
			userId
		} = req.body;

		const userPlaylist = new UserPlaylist({
			name,
			createdBy: userId,
		});

		const playlistData = await userPlaylist.save();

		res.send({
			status: true,
			data: playlistData,
		});
	} catch (error) {
		res.send({
			status: false,
			data: error.toString(),
		});
	}
});

// add songs into Playlist
router.post("/addsongs", async (req, res) => {
	try {
		const {
			songs,
			playlistId
		} = req.body;

		const playlist = await UserPlaylist.findOne({
			_id: playlistId,
		});

		// yet to hit obs-core addsongs endpoint
		const addSongsCoreUrl = `${config.get("isDev") ? config.get("baseurl").dev : config.get("baseurl").prod}/addsongs`;

		if (playlist && songs.length) {
			const availableSongs = playlist.songs;
			const songIds = songs.map(song => song.videoId)
			let newSongsList = [...songIds, ...availableSongs];
			newSongsList = uniq(newSongsList);
			axios.post(addSongsCoreUrl, {
				songs: [...songs]
			})
			const updateObj = {
				updatedAt: Date.now(),
				totalSongs: newSongsList.length,
				thumbnail: songs[0].thumbnail,
				songs: newSongsList
			};
			await playlist.updateOne(updateObj);
			res.send({
				status: true,
				data: "songs successfully added!",
			});
		} else {
			throw new Error("something went wrong!")
		}

	} catch (error) {
		res.send({
			status: false,
			data: error.message,
		});
	}
});

// get all playlist metadata
router.get("/getallplaylistmetadata/:uid", async (req, res) => {
	try {
		const uid = req.params.uid;

		const metaData = await UserPlaylist.find({
			createdBy: uid,
		}, {
			_id: true,
			name: 1,
			thumbnail: 2,
			totalSongs: 3,
		}, );
		res.send({
			status: true,
			data: metaData,
		});
	} catch (error) {
		res.send({
			status: false,
			data: error.toString(),
		});
	}
});

// get user playlist -  yet to implement song playlist
router.get("/getplaylist/:id", async (req, res) => {
	try {
		const playlistId = req.params.id;
		const data = await UserPlaylist.findOne({
			_id: playlistId,
		});
		const songsDataFetchUrl = `${config.get("isDev") ? config.get("baseurl").dev : config.get("baseurl").prod}/getsongs`;
		const songIds = data.songs;
		const songs = (await axios.post(songsDataFetchUrl, {
			songIds
		})).data.data;
		let tempData = {
			...data['_doc'],
			songs: [...songs],
		}
		res.send({
			status: true,
			data: tempData,
		});
	} catch (error) {
		res.send({
			status: false,
			data: error.message
		});
	}
});

// delete songs from playlist
router.post("/deletesong", async (req, res) => {
	try {
		const {
			playlistId,
			songId
		} = req.body;

		await UserPlaylist.findByIdAndUpdate(playlistId, {
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
			const songsCoreUrl = `${config.get("isDev") ? config.get("baseurl").dev : config.get("baseurl").prod}/getsong/${lastSongId}`;
			const newThumbData = (await axios.get(songsCoreUrl)).data;
			if (newThumbData.status) {
				newThumbnail = newThumbData.data.thumbnail
			}
		}
		await playlist.updateOne({
			updatedAt: Date.now(),
			totalSongs: playlist.songs.length,
			thumbnail: newThumbnail,
		});

		await playlist.save();

		res.send({
			status: true,
			data: "Song has been deleted successfully",
		});
	} catch (error) {
		res.send({
			status: false,
			data: error.toString(),
		});
	}
});

// update name of the playlist
router.post("/updatename", async (req, res) => {
	try {
		const {
			name,
			playlistId
		} = req.body;

		const playlist = await UserPlaylist.findOne({
			_id: playlistId,
		});

		await playlist.updateOne({
			name,
			updatedAt: Date.now(),
		});

		res.send({
			status: true,
			data: "Playlist name changed successfully!",
		});
	} catch (error) {
		res.send({
			status: false,
			data: error.toString(),
		});
	}
});

//delete playlist
router.get("/delete/:id", async (req, res) => {
	try {
		const _id = req.params.id;

		const playlist = await UserPlaylist.findOne({
			_id,
		});

		await playlist.deleteOne();

		res.send({
			status: true,
			data: "playlist deleted successfully!",
		});
	} catch (error) {
		res.send({
			status: false,
			data: error.toString(),
		});
	}
});

export default router;