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
			//let artistName = movieArr[1].trim();
			const query = `${title} ${movieName}`;
			// let thumbnail = $(el)
			// 	.children(".pannel03")
			// 	.find(".movieImg")
			// 	.find("img")
			// 	.attr("src");
			// let videoId = null;
			// if (thumbnail.includes("http://img.youtube.com")) {
			// 	videoId = thumbnail.replace("https://", "").split("/")[4];
			// }
			// if (videoId) {
			// 	const temp = {
			// 		videoId,
			// 		rank,
			// 		title,
			// 		thumbnail,
			// 	};
			// 	let chart = await TopChart.findById(chartId);
			// 	if (Object.is(rank, "01")) {
			// 		chart.thumbnail = thumbnail;
			// 	}
			// 	chart.songs.push(temp);
			// 	await chart.save();
			// } else {
			let n = 0;
			while (true) {
				if (n < 2) {
					if (await coreFallback(query, title, rank, chartId)) {
						break;
					}
				} else {
					break;
				}
				n++;
			}
			// }
		});
	} catch (error) {
		console.error(error);
	}
};

// export const updateEnglishTopCharts = async chartId => {
// 	try {
// 		let playres = await fetchRetry(
// 			`https://www.officialcharts.com/charts/singles-chart//`,
// 			2,
// 		);
// 		playres = await playres.text();
// 		const $ = cheerio.load(playres.trim());
// 	} catch (error) {
// 		console.error(error.message);
// 	}
// };

async function coreFallback(query, title, rank, chartId) {
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
			response.title = title;
			response = {
				rank,
				...response,
			};
			let chart = await TopChart.findById(chartId);
			if (Object.is(rank, "01")) {
				chart.thumbnail = response.thumbnail;
			}
			chart.songs.push(response);
			await chart.save();
			isSuccess = true;
		}
	} catch (error) {
		console.error(error.message);
	}
	return isSuccess;
}