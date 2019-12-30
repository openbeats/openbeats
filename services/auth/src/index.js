import middleware from "./config/middleware";
import express from "express";
import dbconfig from "./config/db";
import authRoutes from "./routes/auth";

//Set up db connection
dbconfig();

const app = express();

middleware(app);

app.use("/", authRoutes);

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log("openbeats server up and running!");
});
