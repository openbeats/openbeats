import express from "express";
import UserPlaylist from "../models/UserPlaylist";
import User from "../models/User";
import uuid from "uuid";

const router = express.Router();

// create empty Playlist
router.post("/create", async (req, res) => {
	try {
		const {
			name,
			userId
		} = req.body;
		const myPid = uuid.v1()
		const userPlaylist = new UserPlaylist({
			name,
			createdBy: userId,
			metaDataId: myPid
		});

		const playlistData = await userPlaylist.save();

		const user = await User.findOne({
			_id: userId,
		});

		await user.myPlaylists.push({
			_id: myPid,
			name,
			playlistId: playlistData._id,
		});
		const userData = await user.save();

		res.send({
			status: true,
			data: playlistData,
			d: userData,
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

		await playlist.songs.push(...songs);

		await playlist.updateOne({
			updatedAt: Date.now(),
		});

		const savedSongs = await playlist.save();

		const songsCount = savedSongs.songs.length

		await User.update({
			"_id": savedSongs.createdBy,
			"myPlaylists._id": savedSongs.metaDataId
		}, {
			$set: {
				"myPlaylists.$.thumbnail": songs[0].thumbnail,
				"myPlaylists.$.totalSongs": songsCount,
			}
		})

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
		const user = await User.findOne({
			_id: uid,
		});
		const playlistMetadata = user.myPlaylists;
		res.send({
			status: true,
			data: playlistMetadata,
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
		const {
			playlistId,
			songId
		} = req.body;

		const playlist = await UserPlaylist.findOne({
			_id: playlistId,
		});

		await playlist.updateOne({
			songs: await playlist.songs.filter(
				item => item._id.toString() !== songId.toString(),
			),
		});

		res.send({
			status: true,
			data: "song delete from playlist successfully!",
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

		const createdBy = playlist.createdBy;

		const user = await User.findOne({
			_id: createdBy,
		});

		await playlist.updateOne({
			name,
			updatedAt: Date.now(),
		});

		await user.updateOne({
			myPlaylists: [
				...(await user.myPlaylists.filter(
					item => item.playlistId !== playlistId,
				)),
				{
					name,
					playlistId,
				},
			],
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

		const userId = playlist.createdBy;
		const user = await User.findOne({
			_id: userId,
		});

		await user.updateOne({
			myPlaylists: await user.myPlaylists.filter(
				item => item.playlistId !== _id,
			),
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