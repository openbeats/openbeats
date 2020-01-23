import middleware from "./config/middleware";
import express from "express";
import { ytcat, suggestbeat, copycat } from "./core";
import ytdl from "ytdl-core";
// import dbconfig from "./config/db";
// dbconfig();

const PORT = process.env.PORT || 2001;

const app = express();

middleware(app);

app.get("/", (req, res) => {
	res.send("Welcome to OpenBeats! Enjoy Unlimited music for free! ");
});

app.get("/opencc/:id", async (req, res) => {
	const videoID = req.params.id;
	try {
		const info = await ytdl.getInfo(videoID);
		let audioFormats = ytdl.filterFormats(info.formats, "audioonly");
		if (!audioFormats[0].contentLength) {
			audioFormats = ytdl.filterFormats(info.formats, "audioandvideo");
		}
		let sourceUrl = audioFormats[0].url;
		res.send({
			status: true,
			link: sourceUrl,
		});
	} catch (error) {
		let link = null;
		let status = 404;
		if (ytdl.validateID(videoID)) {
			link = await copycat(videoID);
			status = 200;
		}
		res.status(status).send({
			status: status === 200 ? true : false,
			link: link,
		});
	}
});

app.get("/ytcat", async (req, res) => {
	try {
		if (!req.query.q) throw new Error("Missing required query param q.");
		const fr = (req.query.fr && true) || false;
		const data = await ytcat(req.query.q, fr);
		res.send({
			status: true,
			data: data,
		});
	} catch (error) {
		console.log(error.message);
		res.send({
			status: false,
			error: error.message,
		});
	}
});

app.get("/suggester", async (req, res) => {
	let data = await suggestbeat(req.query.k);
	res.send({
		status: true,
		data: data,
	});
});

app.listen(PORT, () => {
	console.log("openbeats server up and running!");
});
