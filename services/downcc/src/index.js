import middleware from "./config/middleware";
import express from "express";
import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import {
	path
} from "@ffmpeg-installer/ffmpeg";
import fetch from "node-fetch";
// import dbconfig from "./config/db";
// dbconfig();
const PORT = process.env.PORT || 2000;

const app = express();
middleware(app);

app.get("/:id", async (req, res) => {
	const videoID = req.params.id;
	try {
		const info = await (await fetch(`https://jkj2ip878k.execute-api.us-east-1.amazonaws.com/default/ytdl?vid=${videoID}`)).json();

		let audioFormats = ytdl.filterFormats(info.formats, "audioonly");
		if (!audioFormats[0].contentLength) {
			audioFormats = ytdl.filterFormats(info.formats, "audioandvideo");
		}
		let sourceUrl = audioFormats[0].url;
		let downloadTitle = `${info.title
			.trim()
			.replace(" ", "_")
			.replace(/[^\w]/gi, "_")}@openbeats`;

		// let contentLength =
		// 	audioFormats[0].contentLength ||
		// 	info.length_seconds * audioFormats[0].audioBitrate * 125;


		res.setHeader(
			"Content-disposition",
			"attachment; filename=" + downloadTitle + ".mp3",
		);
		res.setHeader("Content-Type", "audio/mpeg");
		// res.setHeader("Content-Length", contentLength);
		ffmpeg({
				source: sourceUrl
			})
			.setFfmpegPath(path)
			.withAudioCodec("libmp3lame")
			.audioBitrate(audioFormats[0].audioBitrate)
			.toFormat("mp3")
			.on("error", err => console.log(err.message))
			.pipe(res, {
				end: true,
			});
	} catch (error) {
		console.log(error);
		let link = null;
		let status = 404;
		if (ytdl.validateID(videoID)) {
			link = await copycat(videoID);
			status = 200;
			res.setHeader(
				"Content-disposition",
				"attachment; filename=" + videoID + ".mp3",
			);
			res.setHeader("Content-Type", "audio/mpeg");
			ffmpeg({
					source: link
				})
				.setFfmpegPath(ffmpegPath)
				.withAudioCodec("libmp3lame")
				.audioBitrate(128)
				.toFormat("mp3")
				.on("error", err => console.log(err.message))
				.pipe(res, {
					end: true,
				});
		} else {
			res.status(status).send({
				status: status === 200 ? true : false,
				link: link,
			});
		}
	}
});

app.listen(PORT, () => {
	console.log("openbeats downcc service up and running!");
});