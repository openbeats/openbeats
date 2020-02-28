import middleware from "./config/middleware";
import express from "express";
import dbconfig from "./config/db";
import croninit from "./routes/croninit";
import topcharts from "./routes/topcharts";
import cron from "node-cron";
import fetchRetry from "./core/refetch";
import config from "config";


dbconfig();
const PORT = 2000 || process.env.PORT;


const app = express();
middleware(app);

app.use("/cron", croninit);
app.use("/topcharts", topcharts);


cron.schedule("0 0 * * 0", async () => {
  let scrapUrl = "";
  if (config.get("isDev")) {
    scrapUrl = config.get("scrapurl").dev;
  } else {
    scrapUrl = config.get("scrapurl").production;
  }
  const result = await (await fetchRetry(`${scrapUrl}/cron/init_topcharts`)).json();
  if (result.status) {
    console.log(`Successfully topcharts cron started.`);
  }
});


app.listen(PORT, () => {
  console.log(`openbeats cronscrap service up and running on ${PORT}!`);
});