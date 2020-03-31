import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
	name: String,
	thumbnail: {
		type: String,
		default:
			"https://openbeats.live/static/media/dummy_music_holder.a3d0de2e.jpg",
	},
	releasedAlbums: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Album",
			default: [],
		},
	],
	featuringAlbums: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Album",
			default: [],
		},
	],
});

artistSchema.methods.addAsReleasedAlbums = async function(albumId) {
	if (!this.releasedAlbums.includes(albumId)) {
		this.releasedAlbums.push(albumId);
		await this.save();
	}
};

artistSchema.methods.addAsFeaturingAlbums = async function(albumId) {
	if (!this.featuringAlbums.includes(albumId)) {
		this.featuringAlbums.push(albumId);
		await this.save();
	}
};

export default mongoose.model("Artist", artistSchema);
