import middleware from "./config/middleware";
import express from "express";
import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import {
	path
} from "@ffmpeg-installer/ffmpeg";
import HttpsProxyAgent from "https-proxy-agent";

// import dbconfig from "./config/db";
// dbconfig();
const PORT = process.env.PORT || 2000;

const app = express();
middleware(app);

app.get("/:id", async (req, res) => {
	const videoID = req.params.id;
	try {
		const proxy = "http://lum-customer-hl_b2084710-zone-static_res-route_err-pass_dyn-country-in:5olhwmb9fyab@zproxy.lum-superproxy.io:22225";
		// const proxy = "http://101.109.255.246:52279";
		// const proxy = "https://api.proxyorbit.com/v1/?token=J0XAus0eRldTAZ17q0RF9QkxFKsTZoaU340Jz1omYO4&youtube=true";
		const agent = new HttpsProxyAgent(proxy);
		const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoID}`, {
			requestOptions: {
				agent: agent
			}
		});
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