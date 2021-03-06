import mongoose from "mongoose";
import { config } from "../config";

export default async () => {
  const mongoUrl = config.mongoURI_DEV;
  await mongoose
    .connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.info("Connection Successful!");
    })
    .catch((err) => console.error("Mongo db connection failed!", err.message));
};
