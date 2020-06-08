import express from "express";
import TopChart from "../models/TopChart";
import {
	fetchTopCharts,
	englishTopCharts,
	fetchMissedSongs
} from "../core/topCharts";
import MissedFetch from "../models/MissedFetch";

const router = express.Router();

router.get("/metadata", async (req, res) => {
	try {
		const metachart = await TopChart.find().select("-songs");
		res.send({
			status: true,
			allcharts: metachart,
		});
	} catch (error) {
		console.error(error.message);
		res.send({
			status: false,
			error: "Internal Server Error.",
		});
	}
});

router.get("/inittopcharts", (req, res) => {
	setTimeout(() => {
		fetchTopCharts();
	}, 0);
	setTimeout(() => {
		englishTopCharts();
	}, 9000);
	res.send({
		status: true,
		msg: "Topcharts fetch initiated",
	});
});

router.get("/inittopcharts/missedsongs", async (req, res) => {
	if (req.query.forcerun && req.query.forcerun === "true") {
		setTimeout(() => {
			fetchMissedSongs(true);
		}, 0);
	}
	const data = await MissedFetch.find();
	res.send({
		status: true,
		data,
	});
});

router.get("/:toplistId", async (req, res) => {
	try {
		const toplistId = req.params.toplistId;
		const {
			name,
			thumbnail,
			language,
			songs,
			createdAt,
			updatedAt,
			createdBy,
			totalSongs
		} = await TopChart.findById(toplistId);
		if (!name) throw new Error("Not found..");
		res.status(200).send({
			status: true,
			data: {
				name,
				thumbnail,
				language,
				songs: songs.filter(song => song.videoId),
				createdAt,
				updatedAt,
				createdBy,
				totalSongs,
			},
		});
	} catch (error) {
		console.error(error.message);
		res.status(200).send({
			status: false,
			error: error.message,
		});
	}
});

export default router;