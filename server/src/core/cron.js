import cron from "node-cron";
import scrapmirchi from "./scrapmirchi";
cron.schedule("*/2 * * * *", () => {
  console.log("cron started and runing");
  scrapmirchi();
});
