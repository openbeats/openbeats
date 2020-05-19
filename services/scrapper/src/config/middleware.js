import cors from "cors";
import express from "express";
import morgan from "morgan";
import {
  config
} from ".";
import {
  json,
  urlencoded
} from "body-parser";

export default (app) => {
  app.use(cors());
  app.use(json({
    limit: "5mb"
  }));
  app.use(
    urlencoded({
      limit: "5mb",
      extended: true,
      parameterLimit: 50000
    })
  );
  app.use(morgan(config.isDev ? "dev" : "tiny"));
};