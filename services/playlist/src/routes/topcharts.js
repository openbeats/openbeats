import express from "express";
import TopChart from "../models/TopChart";

const router = express.Router();

router.get("/metadata", async (req, res) => {
	try {
		const metachart = await TopChart.find().select("-songs");
		res.status(200).send({
			status: true,
			allcharts: metachart
		});
	} catch (error) {
		console.error(error.message);
		res.status(200).send({
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

export default router;