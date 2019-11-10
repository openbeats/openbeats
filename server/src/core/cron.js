import cron from "node-cron";
import scrapmirchi from "./scrapmirchi";

cron.schedule("*/1 * * * *", async () => {
  console.log("cron started and runing");
  await scrapmirchi();
  console.log("Over");
});
