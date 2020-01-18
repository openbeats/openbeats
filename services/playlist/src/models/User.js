import mongoose from "mongoose";

export default mongoose.model(
	"User",
	new mongoose.Schema({
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
		},
		avatar: {
			type: String,
		},
		date: {
			type: Date,
			default: Date.now,
		},
		myPlaylists: [{
			name: String,
			playlistId: String
		}],
		playlistCollections: [{
			name: String,
			playlistId: String
		}],
		likedPlaylists: [{
			name: String,
			playlistId: String
		}],
		recentlyPlayedSongs: {
			type: Array,
			default: []
		}
	}),
);