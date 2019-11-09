import "dotenv/config";
import middleware from "./config/middleware";
import express from "express";
import { ytcat, suggestbeat } from "./core";
//remove
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
//remove
const ytdl = require("ytdl-core");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const app = express();
const http = require("https");
// import dbconfig from './config/db';
// dbconfig();

middleware(app);

app.get("/", (req, res) => {
  res.send("Welcome to OpenBeats!\n Enjoy Unlimited music for free! ");
});

app.get("/opencc/:id", async (req, res) => {
  const videoID = req.params.id;
  await ytdl
    .getInfo(videoID)
    .then(info => {
      const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
      let reqFormat = audioFormats.filter(function(item) {
        return item.audioBitrate == 128;
      });
      let sourceUrl = reqFormat[0].url;
      if (!reqFormat[0].clen) {
        throw new Error("content-length-not-found");
      }
      res.send({
        status: true,
        link: sourceUrl,
      });
    })
    .catch(err => {
      res.send({
        status: false,
        link: null,
      });
    });
});

app.get("/fallback/:id", async (req, res) => {
  const videoID = req.params.id;
  await ytdl
    .getInfo(videoID)
    .then(info => {
      const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
      let reqFormat = audioFormats.filter(function(item) {
        return item.audioBitrate == 128;
      });

      let sourceUrl = reqFormat[0].url;
      if (!reqFormat[0].clen) {
        throw new Error("content-length-not-found");
      }
      let fileSize = reqFormat[0].clen;
      let mimeType = reqFormat[0].type;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = end - start + 1;
        const head = {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": mimeType,
        };
        res.writeHead(206, head);
        http.get(
          sourceUrl,
          {
            headers: {
              Range: req.headers.range,
            },
          },
          function(response) {
            response.pipe(res);
          },
        );
      } else {
        const head = {
          "Content-Length": fileSize,
          "Content-Type": mimeType,
        };
        res.writeHead(200, head);
        http.get(sourceUrl, function(response) {
          response.pipe(res);
        });
      }
    })
    .catch(err => {
      res.status(404).send({
        status: false,
        link: null,
      });
    });
});

app.get("/downcc/:id", async (req, res) => {
  const videoID = req.params.id;
  await ytdl
    .getInfo(videoID)
    .then(info => {
      const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
      let reqFormat = audioFormats.filter(function(item) {
        return item.audioBitrate == 128;
      });
      if (!reqFormat[0].clen) {
        throw new Error("content-length-not-found");
      }
      let downloadTitle = `${info.title.trim().replace(" ", "")}@openbeats`;
      downloadTitle = downloadTitle.replace(
        /[&\/\\#,+()\|" "$~%.'":*?<>{}-]/g,
        "",
      );
      let sourceUrl = reqFormat[0].url;
      let contentLength = reqFormat[0].clen;
      res.setHeader(
        "Content-disposition",
        "attachment; filename=" + downloadTitle + ".mp3",
      );
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Content-Length", contentLength);
      ffmpeg({ source: sourceUrl })
        .setFfmpegPath(ffmpegPath)
        .withAudioCodec("libmp3lame")
        .audioBitrate("128k")
        .toFormat("mp3")
        .on("error", err => {
          console.log(err.message);
        })
        .pipe(
          res,
          {
            end: true,
          },
        );
    })
    .catch(err => {
      res.status(404).send({
        status: false,
        link: null,
      });
    });
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

app.get("/test", async (req, res) => {
  const langsFetch = [
    "punjabi-top-10",
    "tamil-top-20",
    "telugu-top-20",
    "malayalam-top-20",
    "marathi-top-20",
    "kannada-top-20",
    "bangla-top-10",
  ];
  let fullResponse = [];
  for (let lang of langsFetch) {
    try {
      let playres = await fetch(`https://www.radiomirchi.com/more/${lang}/`);
      let language = lang.substring(0, lang.indexOf("-"));
      playres = await playres.text();
      let DOM = new JSDOM(playres.trim());
      let targetCollection = DOM.window.document.getElementsByClassName(
        "top01",
      );
      let songlist = [];
      for (let i = 0; i < targetCollection.length; i++) {
        let rank = i + 1;
        let title = targetCollection[i].children
          .item(3)
          .getElementsByClassName("header")[0]
          .getElementsByTagName("h2")[0].textContent;
        let thumbnail = targetCollection[i].children
          .item(4)
          .getElementsByClassName("movieImg")[0]
          .getElementsByTagName("img")[0].src;
        let videoId = "";
        if (thumbnail.replace("https://", "").split("/")[4]) {
          videoId = thumbnail.replace("https://", "").split("/")[4];
        }
        if (videoId) {
          let song = {
            videoId,
            rank,
            title,
            thumbnail,
          };
          songlist.push(song);
        } else {
          try {
            let result = await ytcat(
              encodeURIComponent(title + " " + language),
              true,
            );
            let videoId = result[0].videoId;
            let thumbnail = result[0].thumbnail;
            let song = {
              videoId,
              rank,
              title,
              thumbnail,
            };
            songlist.push(song);
          } catch (err) {
            console.error(err.message);
          }
        }
      }
      if (songlist.length > 0) {
        fullResponse.push({
          status: true,
          language,
          songlist,
        });
      } else {
        fullResponse.push({
          status: false,
          language: lang.substring(0, lang.indexOf("-")),
          errorMessage: "Couldn't find songs.",
        });
      }
    } catch (error) {
      console.error(error.message);
      fullResponse.push({
        status: false,
        language: lang.substring(0, lang.indexOf("-")),
        errorMessage: "NOT-FOUND",
      });
      continue;
    }
  }
  res.status(200).json({
    status: true,
    fullResponse,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("openbeats server up and running on port :", PORT);
});
