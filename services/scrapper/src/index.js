import middleware from "./config/middleware";
import express from "express";
import dbconfig from "./config/db";
import fetchSongs from "./routes/fetchSongsRoute";

dbconfig();

const PORT = process.env.PORT || 6000;

const app = express();

middleware(app);

app.use("/fetchsongs", fetchSongs);

app.listen(PORT, () => {
  console.log(`openbeats scrapping service up and running on ${PORT}!`);
});