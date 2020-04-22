import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
	name: String,
	thumbnail: {
		type: String,
		default: "https://openbeats.live/static/media/dummy_music_holder.a3d0de2e.jpg",
	},
	popularityCount: {
		type: Number,
		default: 0
	}
});

export default mongoose.model("Artist", artistSchema);