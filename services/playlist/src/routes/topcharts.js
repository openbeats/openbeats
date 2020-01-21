import express from "express";
import TopChart from "../models/TopChart";

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const chart = await TopChart.find();
		res.status(200).send({ status: true, allcharts: chart });
	} catch (error) {
		console.error(error.message);
		res.status(500).send({ status: false, error: "Internal Server Error." });
	}
});

router.get("/:language", async (req, res) => {
	try {
		const language = req.params.language.toLowerCase();
		const chart = await TopChart.findOne({ language });
		if (!chart) throw new Error("Not found..");
		res.status(200).send({ status: true, chart });
	} catch (error) {
		console.error(error.message);
		res.status(500).send({ status: false, error: error.message });
	}
});

export default router;
