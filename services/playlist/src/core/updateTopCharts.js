import fetchRetry from "./refetch";
import cheerio from "cheerio";
import TopChart from "../models/TopChart";
import config from "config";

export default async (chartName, chartId, language) => {
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
			let title = $(el)
				.children(".pannel02")
				.find(".header")
				.find("h2")
				.text();
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
					if (await coreFallback(title, language, rank, chartId)) {
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

async function coreFallback(title, language, rank, chartId) {
	let isSuccess = false;
	const baseurl = config.get("isDev") ?
		config.get("baseurl").dev :
		config.get("baseurl").production;
	try {
		const data = await fetchRetry(
			`${baseurl}/ytcat?q=${encodeURIComponent(
				title + " " + language + " " + "audio",
			)}&fr=${true}`,
			2,
		);
		const result = await data.json();
		if (result.data.length) {
			let response = result.data[0];
			response = {
				rank,
				...response
			}
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