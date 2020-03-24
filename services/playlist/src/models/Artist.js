import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
  name: String,
  thumbnail: {
    type: String,
    default: "https://openbeats.live/static/media/dummy_music_holder.a3d0de2e.jpg"
  },
  albumTags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Album",
    default: []
  }]
})

artistSchema.methods.addAlbumTag = async function (albumId) {
  if (!this.albumTags.includes(albumId)) {
    this.albumTags.push(albumId);
    this.save();
  }
};

export default mongoose.model(
  "Artist",
  artistSchema
);