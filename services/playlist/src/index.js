import middleware from "./config/middleware";
import express from "express";
import dbconfig from "./config/db";
import userPlaylistRoutes from "./routes/userPlaylist";
import topchart from "./routes/topchart";
import album from "./routes/album";
import artist from "./routes/artist";
import searchtag from "./routes/searchtag";
import emotion from "./routes/emotion";
import language from "./routes/language";
import metadata from "./routes/metadata";

dbconfig();

const PORT = process.env.PORT || 2000;

const app = express();

middleware(app);

app.use("/album", album);
app.use("/userplaylist", userPlaylistRoutes);
app.use("/topcharts", topchart);
app.use("/artist", artist);
app.use("/searchtag", searchtag);
app.use("/emotion", emotion);
app.use("/language", language);
app.use("/metadata", metadata);

app.listen(PORT, () => {
	console.log(`openbeats playlist service up and running on ${PORT}!`);
});