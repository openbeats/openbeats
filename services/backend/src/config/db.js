import mongoose from "mongoose";
import config from "config";

export default async () => {
	await mongoose
		.connect(config.get("mongoURI"), {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		})
		.then(() => console.log("Mongo db connected!"))
		.catch(err => console.error("Mongo db connection failed!", err.message));
};
