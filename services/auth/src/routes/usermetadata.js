import {
	Router
} from "express";
import User from "../models/User";
import auth from "../config/auth";
import {
	uniq
} from "lodash";

const router = Router();

router.post("/recentlyplayed", async (req, res) => {
	const userId = req.body.userId;
	const videoId = req.body.videoId;
	setTimeout(async () => {
		try {
			const user = await User.findById(userId);
			if (user) {
				let recentlyPlayedIds = user.recentlyPlayedSongs;
				if (recentlyPlayedIds.indexOf(videoId) !== -1)
					recentlyPlayedIds = recentlyPlayedIds.splice(recentlyPlayedIds.indexOf(videoId), 1);
				recentlyPlayedIds.unshift(videoId);
				recentlyPlayedIds = uniq(recentlyPlayedIds);
				recentlyPlayedIds = recentlyPlayedIds.slice(0, 30);
				user.recentlyPlayedSongs = recentlyPlayedIds;
				await user.save();
			}
		} catch (error) {}
	}, 0);
	res.send({
		status: true,
		data: "Song added to recently played.",
	});
});

router.get("/recentlyplayed", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).populate("recentlyPlayedSongsList");
		res.send({
			id: req.user.id,
			status: true,
			data: user["$$populatedVirtuals"]["recentlyPlayedSongsList"],
		});
	} catch (error) {
		res.send({
			status: false,
			data: "Internal server error.",
		});
	}
});

router.post("/mycollections", async (req, res) => {
	const {
		userId,
		albumId
	} = req.body;
	try {
		const user = await User.findById(userId);
		if (user) {
			if (user.likedPlaylists.indexOf(albumId) === -1) {
				user.likedPlaylists.push(albumId);
				await user.save();
				res.send({
					status: true,
					data: "Album added to the collection!",
				});
			} else {
				throw new Error("Album is Already in the Collections!");
			}
		} else {
			throw new Error("User Not found!");
		}
	} catch (error) {
		res.send({
			status: false,
			data: error.message,
		});
	}
});

router.delete("/mycollections", async (req, res) => {
	const {
		userId,
		albumId
	} = req.body;
	console.log("reaches herere....", userId, albumId)
	try {
		const user = await User.findById(userId);
		console.log(user)
		if (user) {
			if (user.likedPlaylists.indexOf(albumId) !== -1) {
				user.likedPlaylists.splice(user.likedPlaylists.indexOf(albumId), 1);
				await user.save();
				res.send({
					status: true,
					data: "Album Removed from the Collection",
				});
			} else {
				throw new Error("Album didn't exists in the Collection!");
			}
		} else {
			throw new Error("User Not found!");
		}
	} catch (error) {
		res.send({
			status: false,
			data: error.message,
		});
	}
});

router.get("/mycollections", auth, async (req, res) => {
	try {
		let user = null;
		if (req.query.metadata)
			user = await User.findById(req.user.id);
		else
			user = await User.findById(req.user.id).populate("likedPlaylists");
		res.send({
			id: req.user.id,
			status: true,
			data: user.likedPlaylists,
		});
	} catch (error) {
		res.send({
			status: false,
			data: "Internal server error.",
		});
	}
});


export default router;