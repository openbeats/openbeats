import mongoose from "mongoose";
import config from "config";

export default async () => {
	let mongoUrl = "";
	if (config.get("isDev")) {
		mongoUrl = config.get("mongoURI_DEV");
	} else {
		mongoUrl = `mongodb://${process.env.DB}/obs-db`;
	}
	await mongoose
		.connect(mongoUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		})
		.then(() => {
			console.log("Connection Successful!");
		})
		.catch(err => console.error("Mongo db connection failed!", err.message));
};
