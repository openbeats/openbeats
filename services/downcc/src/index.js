import middleware from "./config/middleware";
import express from "express";
import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import {
	path
} from "@ffmpeg-installer/ffmpeg";
import fetch from "node-fetch";
import redis from "./config/redis";
import {
	config
} from "./config";
import isSafe from "./utils/isSafe";
// import dbconfig from "./config/db";
// dbconfig();
const PORT = process.env.PORT || 2000;

const app = express();
middleware(app);

app.get("/:id", async (req, res) => {
	const videoID = req.params.id;
	try {
		if (!ytdl.validateID(videoID)) throw new Error("Invalid id");
		const streamDetails = new Promise((resolve, reject) => {
			redis.get(videoID, async (err, sourceUrl) => {
				if (sourceUrl) {
					let downloadTitle = `${req.query.title ? req.query.title : videoID}`;
					downloadTitle = `${downloadTitle.trim().replace(" ", "_").replace(/[^\w]/gi, "_")}@openbeats`;
					return resolve({
						sourceUrl,
						downloadTitle
					})
				} else {
					let info = await (await fetch(`${config.ytdlLambda+videoID}`)).json();
					if (!(isSafe(() => info.formats[0].url))) {
						return reject("Cannot fetch the requested song...");
					}
					let audioFormats = ytdl.filterFormats(info.formats, "audioonly");
					if (!audioFormats[0].contentLength) {
						audioFormats = ytdl.filterFormats(info.formats, "audioandvideo");
					}
					let sourceUrl;
					if (audioFormats.length > 0 && audioFormats[0].url && audioFormats[0].url !== undefined) {
						sourceUrl = audioFormats[0].url;
						let downloadTitle = `${info.title.trim().replace(" ", "_").replace(/[^\w]/gi, "_")}@openbeats`;
						redis.set(videoID, sourceUrl, err => {
							if (err) console.error(err);
							else {
								redis.expire(videoID, 20000, err => {
									if (err) console.error(err);
								});
							}
						});
						return resolve({
							sourceUrl,
							downloadTitle
						});
					}
					return reject("Cannot fetch the requested song...");
				}
			})
		})
		const details = await streamDetails;
		res.setHeader("Content-disposition", "attachment; filename=" + details.downloadTitle + ".mp3");
		res.setHeader("Content-Type", "audio/mpeg");
		ffmpeg({
				source: details.sourceUrl,
			})
			.setFfmpegPath(path)
			.withAudioCodec("libmp3lame")
			.toFormat("mp3")
			.on("error", err => {
				throw new Error(err.message);
			})
			.pipe(res, {
				end: true,
			});
	} catch (error) {
		return res.status(408).send({
			status: false,
			link: null,
		});
	}
});

app.listen(PORT, () => {
	console.log(`openbeats downcc service up and running on ${PORT}!`);
});