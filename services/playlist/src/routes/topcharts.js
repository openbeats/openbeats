import express from "express";
import TopChart from "../models/TopChart";
import {
	fetchTopCharts,
	englishTopCharts
} from "../core/topCharts";

const router = express.Router();

router.get("/metadata", async (req, res) => {
	try {
		const metachart = await TopChart.find().select("-songs");
		res.send({
			status: true,
			allcharts: metachart
		});
	} catch (error) {
		console.error(error.message);
		res.send({
			status: false,
			error: "Internal Server Error."
		});
	}
});

router.get("/:toplistId", async (req, res) => {
	try {
		const toplistId = req.params.toplistId;
		const chart = await TopChart.findById(toplistId);
		if (!chart) throw new Error("Not found..");
		res.status(200).send({
			status: true,
			data: chart
		});
	} catch (error) {
		console.error(error.message);
		res.status(200).send({
			status: false,
			error: error.message
		});
	}
});

router.get("/inittopcharts", (req, res) => {
	setTimeout(() => {
		fetchTopCharts();
		englishTopCharts();
	}, 0);
	res.send({
		status: true,
		msg: "Topcharts fetch initiated"
	});
});

export default router;