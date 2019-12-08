import "dotenv/config";
import middleware from "./config/middleware";
import express from "express";
import { ytcat, suggestbeat, copycat } from "./core";
//import initCron from "./core/updatePlaylistCron";
import ytdl from "ytdl-core";
import http from "https";
import localdb from "./config/localdb";
import { path } from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
// import dbconfig from './config/db';
// dbconfig();

const ffmpegPath = path;

const app = express();

//initCron();

middleware(app);

app.get("/", (req, res) => {
  res.send("Welcome to OpenBeats!\n Enjoy Unlimited music for free! ");
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

app.get("/fallback/:id", async (req, res) => {
  const videoID = req.params.id;
  try {
    const info = await ytdl.getInfo(videoID);
    let audioFormats = ytdl.filterFormats(info.formats, "audioonly");
    if (!audioFormats[0].clen) {
      audioFormats = ytdl.filterFormats(info.formats, "audioandvideo");
    }
    let sourceUrl = audioFormats[0].url;
    const range = req.headers.range;
    if (range) {
      http.get(
        sourceUrl,
        {
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
    console.error(error.message);
    res.status(404).send({
      status: false,
      link: null,
    });
  }
});

app.get("/downcc/:id", async (req, res) => {
  const videoID = req.params.id;
  try {
    const info = await ytdl.getInfo(videoID);
    let audioFormats = ytdl.filterFormats(info.formats, "audioonly");
    if (!audioFormats[0].clen) {
      audioFormats = ytdl.filterFormats(info.formats, "audioandvideo");
    }
    let sourceUrl = audioFormats[0].url;
    let downloadTitle = `${info.title
      .trim()
      .replace(" ", "_")
      .replace(/[^\w]/gi, "_")}@openbeats`;
    let contentLength =
      audioFormats[0].clen ||
      info.length_seconds * audioFormats[0].audioBitrate * 125;
    res.setHeader(
      "Content-disposition",
      "attachment; filename=" + downloadTitle + ".mp3",
    );
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", contentLength);
    ffmpeg({ source: sourceUrl })
      .setFfmpegPath(ffmpegPath)
      .withAudioCodec("libmp3lame")
      .audioBitrate(audioFormats[0].audioBitrate)
      .toFormat("mp3")
      .on("error", err => console.log(err.message))
      .pipe(res, {
        end: true,
      });
  } catch (error) {
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
      ffmpeg({ source: link })
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

app.get("/getcharts", async (req, res) => {
  let chart = null;
  if (req.query.lang) {
    chart = localdb
      .get("opencharts")
      .find({ language: req.query.lang })
      .value();
  } else {
    chart = localdb.get("opencharts").value();
  }
  if (!chart) {
    res.status(404).send({
      status: false,
      error: "Cannot find charts in specified language.",
    });
  } else {
    res.send({
      status: true,
      chart,
    });
  }
});

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log("openbeats server up and running on port :", PORT);
});
