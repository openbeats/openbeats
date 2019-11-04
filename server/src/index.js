import 'dotenv/config';
import middleware from './config/middleware';
// import dbconfig from './config/db';
import express from 'express';
import { ytcat, copycat, suggestbeat } from './core'
const ytdl = require('ytdl-core');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

const app = express();


middleware(app);
// dbconfig();


app.get("/", (req, res) => {
    res.send("Welcome to OpenBeats!\n Enjoy Unlimited music for free! ")
})

app.get("/opencc/:id", (req, res) => {
    const videoID = req.params.id;
    ytdl.getInfo(videoID, (err, info) => {
        if (err) {
            res.send({
                status: false,
                link: null
            });
        }
        const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        let reqFormat = audioFormats.filter(function (item) {
            return item.audioBitrate == 128
        })
        let sourceUrl = reqFormat[0].url

        res.send({
            status: true,
            link: sourceUrl
        });
    });
})

app.get('/downcc/:id', (req, res) => {
    const videoID = req.params.id;
    ytdl.getInfo(videoID, (err, info) => {
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
