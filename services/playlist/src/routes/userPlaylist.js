import express from "express";
import UserPlaylist from "../models/UserPlaylist";

const router = express.Router();

// create empty Playlist
router.post("/create", async (req, res) => {
	try {
		const { name, userId } = req.body;

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
		const { songs, playlistId } = req.body;

		const playlist = await UserPlaylist.findOne({
			_id: playlistId,
		});

		const newSongVideoId = songs.videoId;

		// if (playlist) {
		// 	const checkPlaylist = await playlist.findOne({
		// 		_id: playlistId,
		// 		"songs.videoId": songs.videoId,
		// 	});
		// 	if (checkPlaylist) {
		// 		return res.json({
		// 			status: false,
		// 			data: "It looks like you have already added that songs.",
		// 		});
		// 	}
		// }

		if (
			playlist.songs.filter(song => song.videoId === newSongVideoId).length != 0
		) {
			return res.json({
				status: false,
				data: "It looks like you have already added that songs.",
			});
		}

		await playlist.songs.push(...songs);

		await playlist.updateOne({
			updatedAt: Date.now(),
			totalSongs: playlist.songs.length,
			thumbnail: songs[0].thumbnail,
		});

		const savedSongs = await playlist.save();

		res.send({
			status: true,
			data: savedSongs,
		});
	} catch (error) {
		res.send({
			status: false,
			data: error.toString(),
		});
	}
});

// get all playlist metadata
router.get("/getallplaylistmetadata/:uid", async (req, res) => {
	try {
		const uid = req.params.uid;

		const metaData = await UserPlaylist.find(
			{
				createdBy: uid,
			},
			{
				_id: true,
				name: 1,
				thumbnail: 2,
				totalSongs: 3,
			},
		);
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

// get user playlist
router.get("/getplaylist/:id", async (req, res) => {
	try {
		const playlistId = req.params.id;
		const data = await UserPlaylist.findOne({
			_id: playlistId,
		});

		res.send({
			status: true,
			data,
		});
	} catch (error) {
		res.send({
			status: false,
			data: error.toString(),
		});
	}
});

// delete songs from playlist
router.post("/deletesong", async (req, res) => {
	try {
		const { playlistId, songId } = req.body;

		await UserPlaylist.findByIdAndUpdate(playlistId, {
			$pull: {
				songs: {
					_id: songId,
				},
			},
		});

		const playlist = await UserPlaylist.findOne({
			_id: playlistId,
		});

		await playlist.updateOne({
			updatedAt: Date.now(),
			totalSongs: playlist.songs.length,
			thumbnail: playlist.songs.length
				? playlist.songs[playlist.songs.length - 1].thumbnail
				: "https://openbeats.live/static/media/dummy_music_holder.a3d0de2e.jpg",
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
		const { name, playlistId } = req.body;

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
