import 'dotenv/config';
import middleware from './config/middleware';
import express from 'express';
import { ytcat, copycat, suggestbeat } from './core'
const ytdl = require('ytdl-core');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const app = express();
const http = require('https');
// import dbconfig from './config/db';
// dbconfig();

middleware(app);

app.get("/", (req, res) => {
    res.send("Welcome to OpenBeats!\n Enjoy Unlimited music for free! ")
})

app.get("/opencc/:id", async (req, res) => {
    const videoID = req.params.id;
    ytdl.getInfo(videoID, (err, info) => {
        if (err) {
            res.send({
                status: false,
                link: null
            })
        }
        const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        let reqFormat = audioFormats.filter(function (item) {
            return item.audioBitrate == 128
        })
        let sourceUrl = reqFormat[0].url
        res.send({
            status: true,
            link: sourceUrl
        })
    });
})

app.get("/fallback/:id", async (req, res) => {
    const videoID = req.params.id;
    ytdl.getInfo(videoID, (err, info) => {
        if (err) {
            res.status(404).send({
                status: false,
                message: "content not available"
            })
        }
        const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');

        let reqFormat = audioFormats.filter(function (item) {
            return item.audioBitrate == 128
        })

        let sourceUrl = reqFormat[0].url
        let fileSize = reqFormat[0].clen
        let mimeType = reqFormat[0].type
        const range = req.headers.range

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-")
            const start = parseInt(parts[0], 10)
            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize - 1
            const chunksize = (end - start) + 1
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': mimeType,
            }
            res.writeHead(206, head);
            http.get(sourceUrl, {
                headers: {
                    'Range': req.headers.range
                }
            }, function (response) {
                response.pipe(res);
            });

        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': mimeType,
            }
            res.writeHead(200, head)
            http.get(sourceUrl, function (response) {
                response.pipe(res);
            });
        }

    });
})

app.get('/downcc/:id', async (req, res) => {
    const videoID = req.params.id;
    await ytdl.getInfo(videoID, (err, info) => {
        if (err) {
            res.status(404).send({
                status: false,
                message: "content not available"
            })
        }
        let downloadTitle = `${info.title.trim().replace(" ", '')}@openbeats`
        const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        let reqFormat = audioFormats.filter(function (item) {
            return item.audioBitrate == 128
        })
        let sourceUrl = reqFormat[0].url
        res.setHeader('Content-disposition', 'attachment; filename=' + downloadTitle + '.mp3');
        ffmpeg({ source: sourceUrl })
            .setFfmpegPath(ffmpegPath)
            .withAudioCodec('libmp3lame')
            .audioBitrate("128k")
            .toFormat('mp3')
            .on('error', (err) => {
                console.log(err.message);
            })
            .pipe(res, {
                end: true
            });
    });
});

app.get("/ytcat", async (req, res) => {
    let data = await ytcat(req.query.q)
    res.send({
        'status': true,
        'data': data
    });
})

app.get("/suggester", async (req, res) => {
    let data = await suggestbeat(req.query.k)
    res.send({
        'status': true,
        'data': data
    });
})

app.listen(process.env.PORT, () => {
    console.log("openbeats server up and running on port :", process.env.PORT);
})
