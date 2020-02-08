import fetchRetry from "./refetch";
import cheerio from "cheerio";
import TopChart from "../models/TopChart";
import config from "config";
import {
	arrangeTopCharts
} from "./topCharts";

export const updateTopCharts = async (chartName, chartId) => {
	try {
		let playres = await fetchRetry(
			`https://www.radiomirchi.com/more/${chartName}/`,
			2,
		);
		playres = await playres.text();
		const $ = cheerio.load(playres.trim());
		const totalSongs = $(".top01").length;
		let promises = []
		$(".top01").each(async (i, el) => {
			let rank = $(el)
				.find(".pannel01")
				.find(".place")
				.find(".circle")
				.text();

			rank = parseInt(rank);

			let title = $(el)
				.children(".pannel02")
				.find(".header")
				.find("h2")
				.text();

			let movie = $(el)
				.children(".pannel02")
				.find(".header")
				.find("h3")
				.text();
			let movieArr = movie.split("\n");
			let movieName = movieArr[0].trim();
			let artistName = movieArr[1].trim();
			const query = `${title} ${movieName}`;
			promises.push(coreFallback(query, title, rank, chartId, movieName, artistName))
		});
		Promise.all(promises).then(() => {
			arrangeTopCharts(chartName);
		});

	} catch (error) {
		console.error(error);
	}
};

async function coreFallback(query, title, rank, chartId, movieName, artistName) {
	let isSuccess = false;
	const baseurl = config.get("isDev") ?
		config.get("baseurl").dev :
		config.get("baseurl").production;
	try {
		const data = await fetchRetry(
			`${baseurl}/ytcat?q=${encodeURIComponent(query)}&fr=${true}`,
			2,
		);
		const result = await data.json();
		if (result.data.length) {
			let response = result.data[0];
			response.title = title + " " + movieName + " | " + artistName;
			response = {
				rank,
				...response,
			};
			let chart = await TopChart.findById(chartId);
			if (Object.is(rank, 1)) {
				chart.thumbnail = response.thumbnail;
			}
			await chart.songs.push(response);
			await chart.save();
			isSuccess = true;
		}
	} catch (error) {
		console.error(error.message);
	}
	return isSuccess;
}