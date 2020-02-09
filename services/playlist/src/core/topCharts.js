import {
	updateTopCharts
} from "./updateTopCharts";
import TopChart from "../models/TopChart";
import fetchRetry from "./refetch";
import config from "config";

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
			updateTopCharts(chartName, chartId);
		}
	} catch (error) {
		console.error(error.message);
	}
};

export const englishTopCharts = async () => {
	console.log("English topcharts started");
	try {
		const name = "English Top 30";
		const language = "English";
		let engChart = await TopChart.findOne({
			name,
		});
		if (!engChart) {
			engChart = new TopChart({
				name,
				language,
				songs: [],
				totalSongs: 0,
				createdBy: "Openbeats",
			});
			await engChart.save();
		} else {
			engChart.songs = [];
			engChart.totalSongs = 0;
			engChart.updatedAt = Date.now();
			await engChart.save();
		}
		const url = `http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${config.get("lastFmAPIKey")}&format=json&perPage=20&limit=30`;
		const engTop = await (await fetchRetry(`${url}`, 2)).json();
		const trackArray = engTop.tracks.track;
		const baseurl = config.get("isDev") ?
			config.get("baseurl").dev :
			config.get("baseurl").production;
		let rank = 1;
		let songs = []
		for (let track of trackArray) {
			let name = track.name;
			let artist = track.artist.name;
			let query = `${name} ${artist} music`;
			const data = await fetchRetry(
				`${baseurl}/ytcat?q=${encodeURIComponent(query)}&fr=${true}`,
				2,
			);

			const result = await data.json();
			if (result.data.length) {
				let response = result.data[0];
				response = {
					rank,
					...response,
				};
				if (Object.is(rank, 1)) {
					engChart.thumbnail = response.thumbnail;
				}
				songs.push(response);
			}
			rank = rank + 1;
		}
		engChart.songs.push(...songs);
		engChart.totalSongs = songs.length;
		engChart.save();
	} catch (error) {
		console.log(error);

	}
};