import mongoose from "mongoose";

export default mongoose.model(
	"TopChart",
	new mongoose.Schema({
		name: {
			type: String,
			required: true,
		},
		language: {
			type: String,
			required: true,
		},
		songs: [
			{
				title: String,
				rank: String,
				thumbnail: String,
				videoId: String,
			},
		],
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
	}),
);
