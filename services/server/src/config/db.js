import mongoose from "mongoose";
import { Book } from "./schema";
import config from "config";

export default async () => {
  let mongoUrl = "";
  if (config.get("isDev")) {
    mongoUrl = config.get("mongoURI_DEV");
  } else {
    mongoUrl = process.env.DB;
  }
  await mongoose
    .connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    .then(() => {
      console.log("Connection Successful!");

      // a document instance
      var book1 = new Book({
        name: "Introduction to Mongoose",
        price: 10,
        quantity: 25
      });

      // save model to database
      book1.save(function(err, book) {
        if (err) return console.error(err);
        console.log(book.name + " saved to bookstore collection.");
      });
    })
    .catch(err => console.error("Mongo db connection failed!", err.message));
};
