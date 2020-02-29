import middleware from "./config/middleware";
import express from "express";
import dbconfig from "./config/db";
import userPlaylistRoutes from "./routes/userPlaylist";
import topcharts from "./routes/topcharts";

dbconfig();

const PORT = process.env.PORT || 2000;

const app = express();

middleware(app);

app.use("/userplaylist", userPlaylistRoutes);
app.use("/topcharts", topcharts);

app.listen(PORT, () => {
	console.log(`openbeats playlist service up and running on ${PORT}!`);
});