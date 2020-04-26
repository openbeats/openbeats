import express from "express";
import middleware from "./config/middleware";
import cron from "node-cron";
import fetch from "node-fetch";
import {
  config
} from "../config";

const PORT = 2000 || process.env.PORT;

const app = express();
middleware(app);

app.get("/", (req, res) => {
  res.send({
    status: true,
    data: "Cron is Healthy!"
  })
});

// sunday midnight 12
cron.schedule("0 0 * * 0", () => {
  const topChartsUrl = config.urls.topcharts;
  fetch(topChartsUrl).then(data => data.json()).then(data => console.log(new Date(Date.now()).toTimeString() + " TopCharts Cron Started!"))
});


app.listen(PORT, () => {
  console.log(`openbeats cron service up and running on ${PORT}!`);
});