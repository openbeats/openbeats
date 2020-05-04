import middleware from "./config/middleware";
import express from "express";
import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import { path } from "@ffmpeg-installer/ffmpeg";
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
				let downloadTitle = `${req.query.title ? req.query.title : videoID}`;
				downloadTitle = `${downloadTitle.trim().replace(" ", "_").replace(/[^\w]/gi, "_")}@openbeats`;
				res.setHeader("Content-disposition", "attachment; filename=" + downloadTitle + ".mp3");
				res.setHeader("Content-Type", "audio/mpeg");
				ffmpeg({
					source: songDetails.sourceUrl,
				})
					.setFfmpegPath(path)
					.withAudioCodec("libmp3lame")
					.toFormat("mp3")
					.on("error", err => console.log(err.message))
					.pipe(res, {
						end: true,
					});
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
				redis.set(videoID, JSON.stringify(songDetails), err => {
					if (err) console.error(err);
					else {
						redis.expire(videoID, 20000, err => {
							if (err) console.error(err);
						});
					}
				});
				let downloadTitle = `${info.title.trim().replace(" ", "_").replace(/[^\w]/gi, "_")}@openbeats`;
				res.setHeader("Content-disposition", "attachment; filename=" + downloadTitle + ".mp3");
				res.setHeader("Content-Type", "audio/mpeg");
				ffmpeg({
					source: songDetails.sourceUrl,
				})
					.setFfmpegPath(path)
					.withAudioCodec("libmp3lame")
					.audioBitrate(audioFormats[0].audioBitrate)
					.toFormat("mp3")
					.on("error", err => console.log(err.message))
					.pipe(res, {
						end: true,
					});
			}
		});
	} catch (error) {
		res.send({
			status: false,
			link: null,
		});
	}
});

app.listen(PORT, () => {
	console.log(`openbeats downcc service up and running on ${PORT}!`);
});
