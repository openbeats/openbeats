import middleware from "./config/middleware";
import express from "express";
import ytdl from "ytdl-core";
import axios from "axios";
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
		const getStreamUrl = new Promise((resolve, reject) => {
			redis.get(videoID, async (err, sourceUrl) => {
				if (!sourceUrl) {
					let info = await (await fetch(`${config.lambda}${videoID}`)).json();
					//checks if there is url property in info object if not calls azure function
					if (!(isSafe(() => info.formats[0].url))) {
						info = await (await fetch(`${config.azureFunction}${videoID}`)).json();
						if (!(isSafe(() => info.formats[0].url))) {
							throw new Error("Cannot fetch the requested song...");
						}
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
		const sourceUrl = "https://r2---sn-npoe7n7s.googlevideo.com/videoplayback?expire=1590156144&ei=EIfHXvuSGYmLz7sPiqakmA0&ip=104.43.19.189&id=o-AKrpQGU9F1iY2FpqGaQ33s0IdAlYG1FtNmQqO_SqkFE9&itag=251&source=youtube&requiressl=yes&mh=Lx&mm=31%2C26&mn=sn-npoe7n7s%2Csn-i3beln7s&ms=au%2Conr&mv=m&mvi=1&pl=17&gcr=sg&initcwndbps=1592500&vprv=1&mime=audio%2Fwebm&gir=yes&clen=4295882&dur=246.661&lmt=1540353785016949&mt=1590134431&fvip=2&keepalive=yes&fexp=23882513&c=WEB&txp=5511222&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cgcr%2Cvprv%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRAIgdftXBGT1xQuVBJmO4TbNQkTgb43XB-4E11kOTuB2ja0CIDtDrlCRQ_NGZvc3_VDM0-yJFl6B4hoblQAY9NZvWT3f&ratebypass=yes&sig=AOq0QJ8wRAIgB9OCNVAmh_tU-IHl-ndaZCf8TZw4s_koKqHH2VNINmECIBpBqIAezR1MR-lkIaColpovdzgBt9X2r8SIspdwD2b2";
		let response;
		if (range) {
			response = await axios({
				method: "get",
				url: sourceUrl,
				responseType: "stream",
				headers: {
					Range: range,
				},
			})
			res.writeHead(206, response.headers);
			response.data.pipe(res);
		} else {
			response = await axios({
				method: "get",
				url: sourceUrl,
				responseType: "stream",
			})
			res.writeHead(200, response.headers);
			response.data.pipe(res);
		}
	} catch (error) {
		redis.del(videoID, (err, result) => console.log(result + err));
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