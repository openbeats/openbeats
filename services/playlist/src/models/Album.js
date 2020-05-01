import mongoose from "mongoose";
import User from "./reference/User";
import Song from "./reference/Song";

const albumSchema = new mongoose.Schema({
	name: String,
	thumbnail: {
		type: String,
		default: "https://openbeats.live/static/media/dummy_music_holder.a3d0de2e.jpg",
	},
	songs: [
		{
			type: String,
		},
	],
	albumBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Artist",
		default: null,
	},
	featuringArtists: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Artist",
		},
	],
	searchVals: { type: [String] },
	searchTags: [{ type: mongoose.Schema.Types.ObjectId, ref: "SearchTag" }],
	totalSongs: {
		type: Number,
		default: 0,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	updatedAt: {
		type: Date,
		default: Date.now(),
	},
	updatedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	popularityCount: {
		type: Number,
		default: 0,
	},
});

albumSchema.index({ name: "text", searchVals: "text" });

albumSchema.virtual("songsList", {
	ref: "Song",
	localField: "songs",
	foreignField: "_id",
	justOne: false,
});

export default mongoose.model("Album", albumSchema);
