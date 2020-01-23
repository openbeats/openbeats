import cron from "node-cron";
import updateTopCharts from "./updateTopCharts";
import TopChart from "../models/TopChart";

export default async () => {
	cron.schedule("0 0 * * 0", async () => {
		try {
			console.log("cron started ...");
			const fetchlist = [
				"bangla-top-10",
				"kannada-top-20",
				"punjabi-top-10",
				"tamil-top-20",
				"telugu-top-20",
				"malayalam-top-20",
				"marathi-top-20",
				"mirchi-top-20",
			];
			for (let chartName of fetchlist) {
				let language = chartName.substring(0, chartName.indexOf("-"));
				language == "mirchi" ? (language = "hindi") : null;
				const chart = await TopChart.findOne({ name: chartName });
				if (!chart) {
					chart = new TopChart({
						name: chartName,
						language,
						songs: [],
						createdBy: "Openbeats",
					});
					await chart.save();
				} else {
					chart.songs = [];
					chart.updatedAt = Date.now();
					await chart.save();
				}
				const chartId = chart.id;
				await updateTopCharts(chartName, chartId, language);
			}
		} catch (error) {
			console.error(error.message);
		}
	});
};
