import mongoose from "mongoose";

export default mongoose.model(
	"TopChart",
	new mongoose.Schema({
		name: {
			type: String,
			required: true,
		},
		thumbnail: {
			type: String,
			default: "https://openbeats.live/static/media/dummy_music_holder.a3d0de2e.jpg",
		},
		language: {
			type: String,
			required: true,
		},
		songs: [{
			title: String,
			rank: String,
			thumbnail: String,
			videoId: String,
		}, ],
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		updatedAt: {
			type: Date,
		},
		createdBy: {
			type: String,
			required: true,
		},
		totalSongs: {
			type: Number,
			default: 0,
		},
	}),
);