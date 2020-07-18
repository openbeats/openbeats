import fetchRetry from "./refetch";
import cheerio from "cheerio";
import TopChart from "../models/TopChart";
import MissedFetch from "../models/MissedFetch"
import {
	config
} from "../config";

export const updateTopCharts = async (chartName, chartId) => {
	try {
		let playres = await fetchRetry(
			`https://www.radiomirchi.com/more/${chartName}/`,
			2,
		);
		playres = await playres.text();
		const $ = cheerio.load(playres.trim());
		let fetchurls = [];
		const baseurl = config.isDev ?
			config.baseurl.dev :
			config.baseurl.prod;
		let chart = await TopChart.findById(chartId);
		$(".top01").each(async (i, el) => {
			let fetchobj = {};
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
			fetchobj.title = `${title} | ${movieName} | ${artistName}`;
			fetchobj.rank = rank;
			fetchobj.url = `${baseurl}/ytcat?q=${encodeURIComponent(`${title} ${movieName}`)}&fr=${true}`;
			fetchurls.push(fetchobj);
		});
		Promise.all(fetchurls.map(async (urlObj) => {
			try {
				let response = await (await fetchRetry(
					urlObj.url,
					2,
				)).json();
				if (response.data.length && response.data.length !== 0) {
					let song = response.data[0];
					song.thumbnail = song.thumbnail.substr(0, song.thumbnail.indexOf("?"));
					if (Object.is(urlObj.rank, 1)) {
						chart.thumbnail = song.thumbnail;
					}
					return {
						rank: urlObj.rank,
						...song,
						title: urlObj.title
					};
				}
				const missedsong = new MissedFetch({
					...urlObj,
					topchartid: chart._id
				});
				await missedsong.save();
			} catch (error) {
				console.error(error);
			}
			return {
				rank: urlObj.rank,
				title: urlObj.title
			};
		})).then(async (data) => {
			chart.songs = data;
			await chart.save();
			chart.totalSongs = chart.songs.length;
			await chart.save();
		})
			.catch((err) => {
				console.error(err.message);
			});
	} catch (error) {
		console.error(error);
	}
};