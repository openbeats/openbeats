import 'dotenv/config';
import middleware from './config/middleware';
import dbconfig from './config/db';
import express from 'express';

import { Copycat } from './core/copycat'


const app = express();

middleware(app);
dbconfig();


app.get("/", (req, res) => {
    res.send("Welcome to OpenBeats!");
})


async function sample() {
    let cc = new Copycat("https://www.youtube.com/watch?v=rfmNAXEJbDE");
    console.log(await cc.generateAudioLink());
}


app.listen(process.env.PORT, () => {
    console.log("openbeats server up and running on port :", process.env.PORT);
})
