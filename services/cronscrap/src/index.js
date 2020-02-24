import middleware from "./config/middleware";
import express from "express";
import dbconfig from "./config/db";
import croninit from "./routes/croninit";
import topcharts from "./routes/topcharts";
import cron from "node-cron";
import fetchRetry from "./core/refetch";


dbconfig();
const PORT = 2000 || process.env.PORT;


const app = express();
middleware(app);

app.use("/cron", croninit);
app.use("/topcharts", topcharts);


cron.schedule("0 0 * * 0", async () => {
  const result = await (await fetchRetry("http://localhost:2000/cron/init_topcharts")).json();
  if (result.status) {
    console.log(`Successfully topcharts cron started.`);
  }
});


app.listen(PORT, () => {
  console.log(`openbeats cronscrap server server up and running on port ${PORT}.`);
});