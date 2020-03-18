import mongoose from "mongoose";

export default mongoose.model(
  "Artist",
  new mongoose.Schema({
    name: String,
    thumbnail: {
      type: String,
      default: "https://openbeats.live/static/media/dummy_music_holder.a3d0de2e.jpg"
    },
    albumTags: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
    }],
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
  }),
);