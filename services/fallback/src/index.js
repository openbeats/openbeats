import middleware from "./config/middleware";
import express from "express";
import ytdl from "ytdl-core";
import axios from "axios";
import fetch from "node-fetch";
import redis from "./config/redis";
import { config } from "./config";
import isSafe from "./utils/isSafe";
// import dbconfig from "./config/db";
// dbconfig();

const PORT = process.env.PORT || 2000;

const app = express();
middleware(app);

app.get("/:id", async (req, res) => {
	const videoID = req.params.id;
	try {
		redis.get(videoID, async (err, songDetails) => {
			if (songDetails) {
				songDetails = JSON.parse(songDetails);
				const { sourceUrl } = songDetails;
				const range = req.headers.range;
				//when seeked range comes in header
				if (range) {
					axios({
						method: "get",
						url: sourceUrl,
						responseType: "stream",
						headers: {
							Range: range,
						},
					}).then(function (response) {
						res.writeHead(206, response.headers);
						response.data.pipe(res);
					});
				} else {
					axios({
						method: "get",
						url: sourceUrl,
						responseType: "stream",
					}).then(function (response) {
						res.writeHead(200, response.headers);
						response.data.pipe(res);
					});
				}
			} else {
				songDetails = {};
				const info = await (await fetch(`${config.lambda}${videoID}`)).json();
				let audioFormats = ytdl.filterFormats(info.formats, "audioonly");
				if (!audioFormats[0].contentLength) {
					audioFormats = ytdl.filterFormats(info.formats, "audioandvideo");
				}
				songDetails.sourceUrl = audioFormats[0].url;
				songDetails.HRThumbnail = isSafe(
					() => info["player_response"]["microformat"]["playerMicroformatRenderer"]["thumbnail"]["thumbnails"][0]["url"]
				);
				const { sourceUrl } = songDetails;
				redis.set(videoID, JSON.stringify(songDetails), err => {
					if (err) console.error(err);
					else {
						redis.expire(videoID, 20000, err => {
							if (err) console.error(err);
						});
					}
				});
				const range = req.headers.range;
				//when seeked range comes in header
				if (range) {
					axios({
						method: "get",
						url: sourceUrl,
						responseType: "stream",
						headers: {
							Range: range,
						},
					}).then(function (response) {
						res.writeHead(206, response.headers);
						response.data.pipe(res);
					});
				} else {
					axios({
						method: "get",
						url: sourceUrl,
						responseType: "stream",
					}).then(function (response) {
						res.writeHead(200, response.headers);
						response.data.pipe(res);
					});
				}
			}
		});
	} catch (error) {
		console.error(error);
		res.send({
			status: false,
			link: null,
		});
	}
});

app.listen(PORT, () => {
	console.log(`openbeats fallback service up and running on ${PORT}!`);
});
