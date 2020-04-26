import middleware from "./config/middleware";
import express from "express";
import {
	ytcat,
	suggestbeat,
	copycat
} from "./core";
import ytdl from "ytdl-core";
import fetch from "node-fetch";
import redis from "./config/redis";
import {
	config
} from "../config";
import dbconfig from "./config/db";
import addtorecentlyplayed from "./config/addtorecentlyplayed";
import Song from "./models/Song";
dbconfig();

const PORT =
	process.env.PORT || config.isDev ?
	config.port.dev :
	config.port.prod;
const app = express();

middleware(app);

app.get("/", (req, res) => {
	res.send("Welcome to OpenBeats! Enjoy Unlimited music for free! ");
});

app.get("/opencc/:id", addtorecentlyplayed, async (req, res) => {
	try {
		const videoID = req.params.id;
		if (!ytdl.validateID(videoID)) throw new Error("INvalid id");
		redis.get(videoID, async (err, value) => {
			try {
				if (value) {
					let sourceUrl = value;
					setTimeout(() => {
						addSongInDeAttachedMode(videoID, req.song);
					}, 0);
					res.send({
						status: true,
						link: sourceUrl,
					});
				} else {
					const info = await (
						await fetch(`${config.lambda}${videoID}`)
					).json();
					if (info.formats) {
						setTimeout(() => {
							addSongInDeAttachedMode(videoID, req.song);
						}, 0);
						let audioFormats = ytdl.filterFormats(info.formats, "audioonly");
						if (!audioFormats[0].contentLength) {
							audioFormats = ytdl.filterFormats(info.formats, "audioandvideo");
						}
						let sourceUrl = audioFormats[0].url;
						redis.set(videoID, sourceUrl, err => {
							if (err) console.error(err);
							else {
								redis.expire(videoID, 20000, err => {
									if (err) console.error(err);
								});
							}
						});
						res.send({
							status: true,
							link: sourceUrl,
						});
					} else {
						throw new Error("Cannot Fetch the requested song");
					}
				}
			} catch (error) {
				let link = null;
				let status = 404;
				if (ytdl.validateID(videoID)) {
					link = await copycat(videoID);
					if (link)
						setTimeout(() => {
							addSongInDeAttachedMode(videoID, req.song);
						}, 0);
					status = 200;
				}
				res.send({
					status: status === 200 ? true : false,
					link: link,
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

app.get("/ytcat", async (req, res) => {
	try {
		if (!req.query.q) throw new Error("Missing required query param q.");
		const fr = (req.query.fr && true) || false;
		res.send({
			status: true,
			data: await ytcat(req.query.q, fr),
		});
	} catch (error) {
		console.log(error);
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

// add song to collection in deattached mod
const addSongInDeAttachedMode = async (videoId, song) => {
	try {
		const findSong = await Song.findOne({
			_id: videoId,
		});
		if (!findSong) {
			let item = null;
			if (!song) {
				item = (await ytcat(videoId, true))[0];
			} else {
				item = {
					...song
				};
			}
			item["_id"] = item.videoId;
			await Song.insertMany([item], {
				ordered: false,
			});
		}
	} catch (error) {
		console.log(error);
	}
};

// song crud operation
app.post("/addsongs", async (req, res) => {
	try {
		let songs = req.body.songs;
		songs = songs.map(elem => {
			let item = elem;
			item["_id"] = elem.videoId;
			return item;
		});
		await Song.insertMany(songs, {
			ordered: false,
		});
		res.send({
			status: true,
			data: "Songs Added successfully!",
		});
	} catch (error) {
		res.send({
			status: true,
			data: "some of the songs already exists in the collection!",
		});
	}
});

app.delete("/deletesong/:id", async (req, res) => {
	try {
		await Song.findOneAndDelete({
			_id: req.params.id,
		});
		res.send({
			status: true,
			data: "Song Deleted successfully!",
		});
	} catch (error) {
		res.send({
			status: false,
			data: error.message,
		});
	}
});

// get song
app.get("/getsong/:id", async (req, res) => {
	try {
		const songData = await Song.findById(req.params.id);
		if (songData)
			res.send({
				status: true,
				data: songData,
			});
		else throw new Error("Song Not found!");
	} catch (error) {
		res.send({
			status: false,
			data: error.message,
		});
	}
});

// get multiple songs at a time
app.post("/getsongs", async (req, res) => {
	const {
		songIds
	} = req.body;
	try {
		const songsPromise = [];
		for (let id of songIds) {
			songsPromise.push(Song.findById(id));
		}
		const songs = await Promise.all(songsPromise)
			.then(songsArr => songsArr)
			.catch(err => {
				throw new Error(err.toString())
			});
		res.send({
			status: true,
			data: songs,
		});
	} catch (error) {
		res.send({
			status: false,
			data: error.message,
		});
	}
});

app.listen(PORT, () => {
	console.log(`openbeats core service up and running on ${PORT}!`);
});