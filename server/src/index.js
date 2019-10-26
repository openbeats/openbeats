import 'dotenv/config';
import middleware from './config/middleware';
import dbconfig from './config/db';
import express from 'express';

const app = express();

middleware(app);
dbconfig();


app.get("/", (req, res) => {
    res.send("Welcome to OpenBeats!");
})


app.listen(process.env.PORT, () => {
    console.log("openbeats server up and running on port : ", process.env.PORT);
})
