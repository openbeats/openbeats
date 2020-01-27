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
<<<<<<< HEAD
		myPlaylists: [
			{
				_id: String,
				name: String,
				playlistId: String,
				thumbnail: {
					type: String,
					default:
						"https://openbeats.live/static/media/dummy_music_holder.a3d0de2e.jpg",
				},
				totalSongs: {
					type: Number,
					default: 0,
				},
			},
		],
		playlistCollections: [
			{
				name: String,
				playlistId: String,
			},
		],
		likedPlaylists: [
			{
				name: String,
				playlistId: String,
			},
		],
=======
		playlistCollections: [{
			name: String,
			playlistId: String,
		}, ],
		likedPlaylists: [{
			name: String,
			playlistId: String,
		}, ],
>>>>>>> 6142c498323b97550dc868c3d5702c9fbb043480
		recentlyPlayedSongs: {
			type: Array,
			default: [],
		},
		isAdmin: {
			type: Boolean,
			default: false
		},
	}),
);
