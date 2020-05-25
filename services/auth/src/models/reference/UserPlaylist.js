import mongoose from "mongoose";
import Song from "./Song";

const userSchema = new mongoose.Schema({
	name: String,
	songs: [{
		type: String,
	}, ],
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	updatedAt: {
		type: Date,
		default: Date.now(),
	},
	createdBy: String,
	metaDataId: String,
	thumbnail: {
		type: String,
		default: "https://openbeats.live/static/media/dummy_music_holder.a3d0de2e.jpg",
	},
	totalSongs: {
		type: Number,
		default: 0,
	},
});

userSchema.index({
	name: "text",
});

userSchema.virtual("songsList", {
	ref: "Song",
	localField: "songs",
	foreignField: "_id",
	justOne: false,
});

export default mongoose.model("UserPlaylist", userSchema);