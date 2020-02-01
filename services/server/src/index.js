import middleware from "./config/middleware";
import express from "express";
import {
	ytcat,
	suggestbeat,
	copycat
} from "./core";
import ytdl from "ytdl-core";
import HttpsProxyAgent from "https-proxy-agent";


// import dbconfig from "./config/db";
// dbconfig();

const PORT = process.env.PORT || 2000;

const app = express();

middleware(app);

app.get("/", (req, res) => {
	res.send("Welcome to OpenBeats! Enjoy Unlimited music for free! ");
});

app.get("/opencc/:id", async (req, res) => {
	console.log("req received")
	const videoID = req.params.id;
	try {
		const proxy = "http://lum-customer-hl_b2084710-zone-static_res-route_err-pass_dyn-country-in:5olhwmb9fyab@zproxy.lum-superproxy.io:22225";
		// const proxy = "http://101.109.255.246:52279";
		// const proxy = "https://api.proxyorbit.com/v1/?token=J0XAus0eRldTAZ17q0RF9QkxFKsTZoaU340Jz1omYO4&youtube=true";
		const agent = new HttpsProxyAgent(proxy);

		console.log("info start", agent)
		const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoID}`, {
			requestOptions: {
				agent: agent
			}
		});
		
		console.log("info", info)
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
		console.log(error)
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