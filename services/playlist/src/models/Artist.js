import mongoose from "mongoose";
import User from "./reference/User";

const artistSchema = new mongoose.Schema({
	name: String,
	thumbnail: {
		type: String,
		default: "https://openbeats.live/static/media/dummy_music_holder.a3d0de2e.jpg",
	},
	popularityCount: {
		type: Number,
		default: 0,
	},
	updatedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});

artistSchema.index({
	name: "text",
});

export default mongoose.model("Artist", artistSchema);
