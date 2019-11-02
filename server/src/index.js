import 'dotenv/config';
import middleware from './config/middleware';
// import dbconfig from './config/db';
import express from 'express';
import { ytcat, copycat, suggestbeat } from './core'
const app = express();

middleware(app);
// dbconfig();


app.get("/", (req, res) => {
    res.send("Welcome to OpenBeats!\n Enjoy Unlimited music for free! ")
})

app.get("/opencc/:id", async (req, res) => {
    let defaultQuality = '128';
    let force = false;
    if (req.query.q) {
        force = true
    }
    if (req.query.q && req.query.q == '128' || req.query.q == '320')
        defaultQuality = req.query.q;

    let ccLink = await copycat(req.params.id, defaultQuality, force);
    res.send({
        'status': true,
        'link': ccLink
    });
})

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
