import middleware from "./config/middleware";
import express from "express";
import ytdl from "ytdl-core";
import axios from "axios";
import fetch from "node-fetch";
import redis from "./config/redis";
import config from "config";
// import dbconfig from "./config/db";
// dbconfig();
const PORT = process.env.PORT || 2000;

const app = express();
middleware(app);

app.get("/:id", async (req, res) => {
	const videoID = req.params.id;
	try {
		redis.get(videoID, async (err, value) => {
			if (value) {
				console.log("exists");
				let sourceUrl = value;
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
					}).then(function(response) {
						res.writeHead(206, response.headers);
						response.data.pipe(res);
					});
				} else {
					axios({
						method: "get",
						url: sourceUrl,
						responseType: "stream",
					}).then(function(response) {
						res.writeHead(200, response.headers);
						response.data.pipe(res);
					});
				}
			} else {
				const info = await (
					await fetch(`${config.get("lambda")}${videoID}`)
				).json();
				let audioFormats = ytdl.filterFormats(info.formats, "audioonly");
				if (!audioFormats[0].contentLength) {
					audioFormats = ytdl.filterFormats(info.formats, "audioandvideo");
				}
				let sourceUrl = audioFormats[0].url;
				redis.set(videoID, sourceUrl, err => {
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
					}).then(function(response) {
						res.writeHead(206, response.headers);
						response.data.pipe(res);
					});
				} else {
					axios({
						method: "get",
						url: sourceUrl,
						responseType: "stream",
					}).then(function(response) {
						res.writeHead(200, response.headers);
						response.data.pipe(res);
					});
				}
			}
		});
	} catch (error) {
		console.error(error);
		res.status(404).send({
			status: false,
			link: null,
		});
	}
});

app.listen(PORT, () => {
	console.log("openbeats fallback service up and running!");
});
