import middleware from "./config/middleware";
import express from "express";
import ytdl from "ytdl-core";
import http from "https";
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
		const range = req.headers.range;
		//when seeked range comes in header
		if (range) {
			http.get(
				sourceUrl, {
					headers: {
						Range: req.headers.range,
					},
				},
				function (response) {
					res.writeHead(206, response.headers);
					response.pipe(res);
				},
			);
		} else {
			http.get(sourceUrl, function (response) {
				res.writeHead(200, response.headers);
				response.pipe(res);
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