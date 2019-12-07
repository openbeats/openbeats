import cors from "cors";
import express from "express";
import morgan from "morgan";
import passport from "passport";

export default app => {
	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(morgan("dev"));
	app.use(passport.initialize());
};
