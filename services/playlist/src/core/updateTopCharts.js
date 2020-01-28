import fetchRetry from "./refetch";
import cheerio from "cheerio";
import TopChart from "../models/TopChart";
import config from "config";
// import axios from "axios";
import fetch from "node-fetch";

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
			let thumbnail = $(el)
				.children(".pannel03")
				.find(".movieImg")
				.find("img")
				.attr("src");
			let videoId = null;
			if (thumbnail.includes("http://img.youtube.com")) {
				videoId = thumbnail.replace("https://", "").split("/")[4];
			}
			if (videoId) {
				const temp = {
					videoId,
					rank,
					title,
					thumbnail,
				};
				let chart = await TopChart.findById(chartId);
				if (Object.is(rank, "01")) {
					chart.topchartThumbnail = thumbnail;
				}
				chart.songs.push(temp);
				await chart.save();
			} else {
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
			}
		});
	} catch (error) {
		console.error(error);
	}
};

async function coreFallback(title, language, rank, chartId) {
	let isSuccess = false;
	const baseurl = config.get("isDev") ? config.get("baseurl").dev : config.get("baseurl").production;
	try {
		const data = await fetch(`${baseurl}/ytcat?q=${encodeURIComponent(title + " " + language)}&fr=${true}`)
		const result = await data.json()
		if (result.data.length) {
			const response = result.data[0];
			const videoId = response.videoId;
			const thumbnail = response.thumbnail;
			const temp = {
				videoId,
				rank,
				title,
				thumbnail,
			};
			let chart = await TopChart.findById(chartId);
			if (Object.is(rank, "01")) {
				chart.thumbnail = thumbnail;
			}
			chart.songs.push(temp);
			await chart.save();
			isSuccess = true;
		}
	} catch (error) {
		console.error(error.message);
	}
	return isSuccess;
}