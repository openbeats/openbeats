import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { config } from "../config";
import Song from "./reference/Song";
import Album from "./reference/Album";

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
	likedPlaylists: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Album",
		},
	],
	recentlyPlayedSongs: [
		{
			type: String,
		},
	],
	admin: {
		status: {
			type: Boolean,
			default: false,
		},
		accessLevel: {
			type: Number,
			enum: [1, 2, 3],
			default: null,
		},
	},
});

userSchema.methods.generateAuthToken = function () {
	const payload = {
		user: {
			id: this.id,
			admin: this.admin,
		},
	};
	const token = jwt.sign(payload, config.jwtSecret);
	return token;
};

userSchema.virtual("recentlyPlayedSongsList", {
	ref: "Song",
	localField: "recentlyPlayedSongs",
	foreignField: "_id",
	justOne: false,
});

export default mongoose.model("User", userSchema);
