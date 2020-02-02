import middleware from "./config/middleware";
import express from "express";
import ytdl from "ytdl-core";
import axios from 'axios'
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
		const range = req.headers.range;
		//when seeked range comes in header
		if (range) {
			axios({
					method: 'get',
					url: sourceUrl,
					responseType: 'stream',
					headers: {
						Range: range
					}
				})
				.then(function (response) {
					res.writeHead(206, response.headers)
					response.data.pipe(res)
				});
		} else {
			axios({
					method: 'get',
					url: sourceUrl,
					responseType: 'stream'
				})
				.then(function (response) {
					res.writeHead(200, response.headers)
					response.data.pipe(res)
				});
		}
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