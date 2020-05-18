import middleware from "./config/middleware";
import express from "express";
import dbconfig from "./config/db";
import fetchSongs from "./routes/fetchsongs";

dbconfig();

const PORT = process.env.PORT || 2000;

const app = express();

middleware(app);

app.use("/gaana", fetchSongs);

app.listen(PORT, () => {
  console.log(`openbeats scrapping service up and running on ${PORT}!`);
});