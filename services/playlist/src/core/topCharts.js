import {
	updateTopCharts
} from "./updateTopCharts";
import TopChart from "../models/TopChart";

export const fetchTopCharts = async () => {
	try {
		console.log("fetch Top Charts Cron started ...");
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
			language = language == "mirchi" ? "hindi" : language;
			let name = chartName.replace(/-/g, " ");
			if (name === "mirchi top 20") {
				name = "hindi top 20"
			}
			const chart = await TopChart.findOne({
				name,
			});
			if (!chart) {
				chart = new TopChart({
					name,
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
			await updateTopCharts(chartName, chartId);
		}
	} catch (error) {
		console.error(error.message);
	}
};

export const arrangeTopCharts = async () => {
	console.log("arrange Top Charts Cron started");
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
	try {
		for (let chartName of fetchlist) {
			let name = chartName.replace(/-/g, " ");
			if (name === "mirchi top 20") {
				name = "hindi top 20"
			}
			const chart = await TopChart.findOne({
				name,
			});
			chart.songs.sort((x, y) => {
				if (x.rank < y.rank) {
					return -1;
				} else {
					return 1;
				}
			});
			chart.totalSongs = chart.songs.length;
			await chart.save();
		}
	} catch (error) {
		console.error(error.message);
	}
};

// export const fetchEnglishCharts = async () => {
// 	try {
// 		const language = "English";
// 		const chart = await TopChart.findOne({
// 			name: "Top 20 English",
// 		});
// 		if (!chart) {
// 			chart = new TopChart({
// 				name: "Top 20 English",
// 				language,
// 				songs: [],
// 				createdBy: "Openbeats",
// 			});
// 			await chart.save();
// 		} else {
// 			chart.songs = [];
// 			chart.updatedAt = Date.now();
// 			await chart.save();
// 		}
// 		const chartId = chart.id;
// 		await updateEnglishTopCharts(chartId);
// 	} catch (error) {
// 		console.error(error.message);
// 	}
// };