import { Router } from "express";
import User from "../models/User";
import auth from "../config/auth";
import config from "config";
import axios from "axios";

const router = Router();

const baseUrl = `${
	config.get("isDev")
		? config.get("corebaseurl").dev
		: config.get("corebaseurl").prod
}`;

router.post("/recentlyplayed", async (req, res) => {
	const userId = req.body.userId;
	const videoId = req.body.videoId;
	setTimeout(async () => {
		try {
			const user = await User.findById(userId);
			if (user) {
				while (!(user.recentlyPlayedSongs.length <= 30)) {
					user.recentlyPlayedSongs.pop();
				}
				user.recentlyPlayedSongs = user.recentlyPlayedSongs.filter(
					vId => vId != videoId,
				);
				user.recentlyPlayedSongs.unshift(videoId);
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
		const user = await User.findById(req.user.id);
		const songsDataFetchUrl = `${baseUrl}/getsongs`;
		const songIds = user.recentlyPlayedSongs;
		const data = (
			await axios.post(songsDataFetchUrl, {
				songIds,
			})
		).data.data;
		res.send({
			id: req.user.id,
			status: true,
			data,
		});
	} catch (error) {
		res.send({
			status: false,
			msg: "Internal server error.",
		});
	}
});

export default router;
