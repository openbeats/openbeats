import mongoose from "mongoose";
const searchTagSchema = new mongoose.Schema({
  searchVal: String,
  albumTags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Album",
  }],
});

searchTagSchema.methods.addAlbumTag = async function (albumId) {
  if (!this.albumTags.includes(albumId)) {
    this.albumTags.push(albumId);
    this.save();
  }
};


export default mongoose.model(
  "SearchTag",
  searchTagSchema
);