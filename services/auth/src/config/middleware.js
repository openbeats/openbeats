import cors from "cors";
import express from "express";
import morgan from "morgan";
import {
	config
} from ".";

export default (app) => {
	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded({
		extended: true
	}));
	app.use(morgan(config.isDev ? "dev" : "tiny"));
};