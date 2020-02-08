import fetchRetry from "./refetch";
import cheerio from "cheerio";
import TopChart from "../models/TopChart";
import config from "config";

export const updateTopCharts = async (chartName, chartId) => {
	try {
		let playres = await fetchRetry(
			`https://www.radiomirchi.com/more/${chartName}/`,
			2,
		);
		playres = await playres.text();
		const $ = cheerio.load(playres.trim());
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
			response.title = title + " | " + movieName + " | " + artistName;
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


const arrangeTopCharts = async (chartName) => {
	try {
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
	} catch (error) {
		console.error(error.message);
	}
};