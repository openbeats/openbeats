import middleware from "./config/middleware";
import express from "express";
import dbconfig from "./config/db";
import checkRootUser from "./config/checkRootUser";
import authRoutes from "./routes/auth";
import usermetadata from "./routes/usermetadata";
import admin from "./routes/admin";
import { config } from "./config";
//Set up db connection
dbconfig();
checkRootUser();

const app = express();

middleware(app);

app.use("/", authRoutes);

app.use("/metadata", usermetadata);

app.use("/admin", admin);

const PORT = process.env.PORT || config.isDev ? config.port.dev : config.port.prod;

app.listen(PORT, () => {
	console.log(`openbeats auth service up and running on ${PORT}!`);
});
