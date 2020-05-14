import middleware from "./config/middleware";
import express from "express";
import dbconfig from "./config/db";
import userPlaylistRoutes from "./routes/userPlaylist";
import topcharts from "./routes/topcharts";
import album from "./routes/album";
import artist from "./routes/artist";
import searchtag from "./routes/searchtag";
import emotion from "./routes/emotion";
import language from "./routes/language";

dbconfig();

const PORT = process.env.PORT || 2000;

const app = express();

middleware(app);

app.use("/album", album);
app.use("/userplaylist", userPlaylistRoutes);
app.use("/topcharts", topcharts);
app.use("/artist", artist);
app.use("/searchtag", searchtag);
app.use("/emotion", emotion);
app.use("/language", language);

app.listen(PORT, () => {
	console.log(`openbeats playlist service up and running on ${PORT}!`);
});