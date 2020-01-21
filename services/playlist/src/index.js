import middleware from "./config/middleware";
import express from "express";
import dbconfig from "./config/db";
import userPlaylistRoutes from "./routes/userPlaylist";
import topcharts from "./routes/topcharts";
import inittopChartsCron from "./core/topChartsCron";

dbconfig();

inittopChartsCron();

const PORT = process.env.PORT || 2000;

const app = express();

middleware(app);

// app.get("/test", (req, res) => {
// 	setTimeout(() => {
// 		inittopChartsCron();
// 	}, 0);
// 	res.send("Started");
// });

app.use("/userplaylist", userPlaylistRoutes);
app.use("/topcharts", topcharts);

app.listen(PORT, () => {
	console.log("openbeats playlist service up and running!");
});
