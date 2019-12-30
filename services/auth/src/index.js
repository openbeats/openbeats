import middleware from "./config/middleware";
import express from "express";
import dbconfig from "./config/db";

//Set up db connection
dbconfig();

const app = express();

middleware(app);

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
	console.log("openbeats server up and running!");
});
