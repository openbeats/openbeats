import mongoose from "mongoose";

export default mongoose.model(
	"UserPlaylist",
	new mongoose.Schema({
		name: String,
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
			default: "https://openbeats.live/static/media/dummy_music_holder.a3d0de2e.jpg"
		},
		totalSongs: {
			type: Number,
			default: 0
		}
	}),
);