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
		} catch (error) {
			console.log(error.message);
		}
	}, 0);
	res.send({
		status: true,
		msg: "Song added to recently played.",
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
			msg: "Internal server error.",
		});
	}
});

export default router;