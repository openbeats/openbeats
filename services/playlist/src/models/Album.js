import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
	name: String,
	thumbnail: {
		type: String,
		default: "https://openbeats.live/static/media/dummy_music_holder.a3d0de2e.jpg"
	},
	songs: [{
		title: String,
		thumbnail: String,
		duration: String,
		videoId: String,
		channelName: String,
		channelId: String,
		uploadedOn: String,
		views: String,
		description: String,
	}],
	artistTags: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Artist",
	}],
	searchTags: [{
		type: String,
	}],
	totalSongs: {
		type: Number,
		default: 0
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
	}
});

albumSchema.methods.addDefultSearchTags = function () {
	if (this.searchTags.length === 0) {
		this.searchTags.push(this.name);
	}
};

export default mongoose.model("Album", albumSchema);