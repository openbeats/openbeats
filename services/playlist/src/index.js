import middleware from "./config/middleware";
import express from "express";
import dbconfig from "./config/db";

dbconfig();

const PORT = process.env.PORT || 2000;

const app = express();

middleware(app);

app.get("/", async (req, res) => {
  res.send("Hello world!");
});




app.listen(PORT, () => {
  console.log("openbeats playlist service up and running!");
});
