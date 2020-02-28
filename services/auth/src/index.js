import middleware from "./config/middleware";
import express from "express";
import dbconfig from "./config/db";
import authRoutes from "./routes/auth";
import usermetadata from "./routes/usermetadata"

//Set up db connection
dbconfig();

const app = express();

middleware(app);

app.use("/", authRoutes);

app.use("/metadata", usermetadata);

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log(`openbeats auth service up and running on ${PORT}!`);
});