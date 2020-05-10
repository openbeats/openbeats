import { updateTopCharts } from "./updateTopCharts";
import TopChart from "../models/TopChart";
import MissedFetch from "../models/MissedFetch";
import fetchRetry from "./refetch";
import { config } from "../config";

export const fetchTopCharts = async () => {
	try {
		console.log("fetch Top Charts Cron started ...");
		const fetchlist = [
			"tamil-top-20",
			"malayalam-top-20",
			"mirchi-top-20",
			"telugu-top-20",
			"bangla-top-10",
			"kannada-top-20",
			"punjabi-top-10",
			"marathi-top-20",
		];
		for (let chartName of fetchlist) {
			let endIndex = chartName.indexOf("-");
			let language = chartName.substring(0, endIndex);
			language = language === "mirchi" ? "hindi" : language;
			let name1 = chartName.substring(endIndex + 1).replace(/-/g, " ");
			let name = `${name1[0].toUpperCase()}${name1.slice(1)} ${language[0].toUpperCase()}${language.slice(1)}`;
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
		const name = "Top 30 English";
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
		const url = `http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${config.lastFmAPIKey}&format=json&perPage=20&limit=30`;
		const engTop = await (await fetchRetry(`${url}`, 2)).json();
		const trackArray = engTop.tracks.track;
		const baseurl = config.isDev ? config.baseurl.dev : config.baseurl.prod;
		let rank = 1;
		const fetchList = [];
		for (let track of trackArray) {
			let fetchObj = {};
			let query = `${track.name} ${track.artist.name} audio`;
			fetchObj.url = `${baseurl}/ytcat?q=${encodeURIComponent(query)}&fr=${true}`;
			fetchObj.title = `${track.name} | ${track.artist.name}`;
			fetchObj.rank = rank;
			fetchList.push(fetchObj);
			rank = rank + 1;
		}
		Promise.all(
			fetchList.map(async urlObj => {
				try {
					let response = await (await fetchRetry(urlObj.url, 2)).json();
					if (response.data.length && response.data.length !== 0) {
						let song = response.data[0];
						if (Object.is(urlObj.rank, 1)) {
							engChart.thumbnail = song.thumbnail;
						}
						return {
							rank: urlObj.rank,
							...song,
							title: urlObj.title,
						};
					}
					const missedsong = new MissedFetch({
						...urlObj,
						topchartid: engChart._id,
					});
					await missedsong.save();
				} catch (error) {
					console.log(error);
				}
				return {
					rank: urlObj.rank,
					title: urlObj.title,
				};
			})
		)
			.then(async data => {
				engChart.songs = data;
				await engChart.save();
				engChart.totalSongs = engChart.songs.length;
				await engChart.save();
				fetchMissedSongs();
			})
			.catch(err => {
				console.log(err.message);
			});
	} catch (error) {
		console.log(error.message);
	}
};

export const fetchMissedSongs = async (forcerun = false) => {
	console.log("Missed songs fetch started.");
	try {
		const missedSongs = await MissedFetch.find();
		if (missedSongs.length > 0) {
			const successfullFullFetch = [];
			for (let missedSong of missedSongs) {
				const response = await (await fetchRetry(missedSong.url, 2)).json();
				const topChart = await TopChart.findById(missedSong.topchartid);
				if (response.data && response.data.length !== 0) {
					topChart.songs[missedSong.rank - 1] = {
						...response.data[0],
						title: missedSong.title,
						rank: missedSong.rank,
					};
					if (Object.is(missedSong.rank, 1)) {
						topChart.thumbnail = response.data[0].thumbnail;
					}
					await topChart.save();
					if (forcerun) {
						topChart.totalSongs = topChart.songs.length;
						await topChart.save();
					}
					successfullFullFetch.push(missedSong._id);
				} else {
					topChart.totalSongs = topChart.totalSongs - 1;
					await topChart.save();
				}
			}
			for (let id of successfullFullFetch) {
				await MissedFetch.findByIdAndDelete(id);
			}
		}
	} catch (error) {
		console.error(error.message);
	}
};
