import middleware from "./config/middleware";
import express from "express";
import ytdl from "ytdl-core";
import axios from "axios";
import fetch from "node-fetch";
import redis from "./config/redis";
import {
	config
} from "./config";
//import isSafe from "./utils/isSafe";
// import dbconfig from "./config/db";
// dbconfig();

const PORT = process.env.PORT || 2000;

const app = express();
middleware(app);

app.get("/:id", async (req, res) => {
	const videoID = req.params.id;
	try {
		if (!ytdl.validateID(videoID)) throw new Error("Invalid id");
		const getStreamUrl = new Promise((resolve, reject) => {
			redis.get(videoID, async (err, sourceUrl) => {
				if (!sourceUrl) {
					const info = await (await fetch(`${config.lambda}${videoID}`)).json();
					if (!info.formats) {
						return reject("Cannot fetch the requested song...");
					}
					let audioFormats = ytdl.filterFormats(info.formats, "audioonly");
					if (!audioFormats[0].contentLength) {
						audioFormats = ytdl.filterFormats(info.formats, "audioandvideo");
					}
					let sourceUrl;
					if (audioFormats.length > 0 && audioFormats[0].url && audioFormats[0].url !== undefined) {
						sourceUrl = audioFormats[0].url;
						redis.set(videoID, sourceUrl, err => {
							if (err) console.error(err);
							else {
								redis.expire(videoID, 20000, err => {
									if (err) console.error(err);
								});
							}
						});
						return resolve(sourceUrl);
					}
					return reject("Cannot fetch the requested song...");
				}
				return resolve(sourceUrl);
			});
		});
		const range = req.headers.range;
		const sourceUrl = await getStreamUrl;
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
	} catch (error) {
		console.error(error.message);
		return res.status(408).send({
			status: false,
			link: null,
		});
	}
});

app.listen(PORT, () => {
	console.log(`openbeats fallback service up and running on ${PORT}!`);
});