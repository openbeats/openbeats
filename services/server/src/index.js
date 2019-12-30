import middleware from "./config/middleware";
import express from "express";
import { ytcat, suggestbeat, copycat } from "./core";
import ytdl from "ytdl-core";
import dbconfig from "./config/db";
dbconfig();

const PORT = process.env.PORT || 2000;

const app = express();

middleware(app);

app.get("/", (req, res) => {
	res.send("Welcome to OpenBeats! Enjoy Unlimited music for free! ");
});
app.get("/check", (req, res) => {
	res.send("Welcome to OpenBeats! check endpoint!!! ");
});

app.get("/opencc/:id", async (req, res) => {
	const videoID = req.params.id;
	try {
		const info = await ytdl.getInfo(videoID);
		let audioFormats = ytdl.filterFormats(info.formats, "audioonly");
		if (!audioFormats[0].clen) {
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
	let data = await ytcat(req.query.q);
	res.send({
		status: true,
		data: data,
	});
});

app.get("/suggester", async (req, res) => {
	let data = await suggestbeat(req.query.k);
	res.send({
		status: true,
		data: data,
	});
});

// app.get("/getcharts", async (req, res) => {
// 	let chart = null;
// 	if (req.query.lang) {
// 		chart = localdb
// 			.get("opencharts")
// 			.find({ language: req.query.lang })
// 			.value();
// 	} else {
// 		chart = localdb.get("opencharts").value();
// 	}
// 	if (!chart) {
// 		res.status(404).send({
// 			status: false,
// 			error: "Cannot find charts in specified language.",
// 		});
// 	} else {
// 		res.send({
// 			status: true,
// 			chart,
// 		});
// 	}
// });

app.listen(PORT, () => {
	console.log("openbeats server up and running!");
});
