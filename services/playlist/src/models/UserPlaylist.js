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
<<<<<<< HEAD
		metaDataId: String,
=======
		metaDataId: String
>>>>>>> 2518239809748b41619eb93d361a1ebe24b6f1d9
	}),
);