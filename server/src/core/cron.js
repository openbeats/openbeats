import cron from "node-cron";
import scrapmirchi from "./scrapmirchi";
import localdb from "../config/localdb";

cron.schedule("*/1 * * * *", async () => {
  console.log("cron started and runing");
  const scrapResponse = await scrapmirchi();
  localdb.set("opencharts", scrapResponse).write();
  localdb.set("lastmodified", Date.now().toString()).write();
});
