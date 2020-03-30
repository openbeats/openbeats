import mongoose from "mongoose";
import Artist from "./Artist";
import SearchTag from "./SearchTag";

const albumSchema = new mongoose.Schema({
	name: String,
	thumbnail: {
		type: String,
		default:
			"https://openbeats.live/static/media/dummy_music_holder.a3d0de2e.jpg",
	},
	songs: [
		{
			type: String,
		},
	],
	albumBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Artist",
	},
	featuringArtists: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Artist",
		},
	],
	searchTags: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "SearchTag",
		},
	],
	totalSongs: {
		type: Number,
		default: 0,
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
	},
});

albumSchema.methods.addDefultSearchTags = async function() {
	await this.addSearchTags([this.name], true);
	await this.save();
};

albumSchema.methods.addAlbumBy = async function(artistId) {
	const artist = await Artist.findById(artistId);
	if (artist) {
		this.albumBy = artist._id;
		await artist.addAsReleasedAlbums(this._id);
	}
};

albumSchema.methods.addSearchTags = async function(
	newSearchTags,
	isCreate = false,
) {
	if (isCreate) {
		const searchTag = await SearchTag({
			searchVal: this.name,
		});
		await searchTag.save();
		this.searchTags.push(searchTag._id);
		await searchTag.addAlbumTag(this._id);
		return;
	}
	for (let tagId of newSearchTags) {
		if (!this.searchTags.includes(tagId)) {
			this.searchTags.push(tagId);
			const searchTag = await SearchTag.findById(tagId);
			if (searchTag) {
				await searchTag.addAlbumTag(this._id);
			}
		}
	}
};

albumSchema.methods.addfeaturingArtists = async function(newArtistTags) {
	for (let tagId of newArtistTags) {
		if (!this.featuringArtists.includes(tagId)) {
			const artist = await Artist.findById(tagId);
			if (artist) {
				this.featuringArtists.push(tagId);
				await artist.addAsFeaturingAlbums(this._id);
			}
		}
	}
};

export default mongoose.model("Album", albumSchema);
