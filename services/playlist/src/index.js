import middleware from "./config/middleware";
import express from "express";
import dbconfig from "./config/db";
import userPlaylistRoutes from "./routes/userPlaylist";
import topcharts from "./routes/topcharts";
import { fetchTopCharts, arrangeTopCharts } from "./core/topCharts";
import cron from "node-cron";

dbconfig();

cron.schedule("0 0 * * 0", async () => {
	fetchTopCharts();
});

cron.schedule("2 0 * * 0", async () => {
	arrangeTopCharts();
});

fetchTopCharts();
setTimeout(() => {
	arrangeTopCharts();
}, 120000);

const PORT = process.env.PORT || 2000;

const app = express();

middleware(app);

// app.get("/test", (req, res) => {
// 	setTimeout(() => {
// 		arrangeTopCharts();
// 	}, 0);
// 	res.send("Started");
// });

app.use("/userplaylist", userPlaylistRoutes);
app.use("/topcharts", topcharts);

app.listen(PORT, () => {
	console.log(`openbeats playlist service up and running on ${PORT}!`);
});
