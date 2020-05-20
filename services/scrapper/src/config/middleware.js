import cors from "cors";
import express from "express";
import morgan from "morgan";
import {
  config
} from ".";
import multer from "multer";
var upload = multer();

export default (app) => {
  app.use(cors());
  app.use(express.json());
  // for parsing multipart/form-data
  app.use(upload.array());
  app.use(express.static('public'));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(config.isDev ? "dev" : "tiny"));
};