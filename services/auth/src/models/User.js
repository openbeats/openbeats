import mongoose from "mongoose";
import Song from "./reference/Song";


const userSchema = new mongoose.Schema({
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
	reset_password_token: {
		type: String,
	},
	avatar: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	likedPlaylists: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Album"
	}],
	recentlyPlayedSongs: [{
		type: String,
	}],
	admin: {
		status: {
			type: Boolean,
			default: false,
		},
	},
})

userSchema.virtual("recentlyPlayedSongsList", {
	ref: "Song",
	localField: 'recentlyPlayedSongs',
	foreignField: '_id',
	justOne: false
});


export default mongoose.model(
	"User",
	userSchema
);
