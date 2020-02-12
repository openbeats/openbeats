import cors from "cors";
import express from "express";
import morgan from "morgan";

export default app => {
	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(morgan("dev"));
};
