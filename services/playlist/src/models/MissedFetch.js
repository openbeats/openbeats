import mongoose from "mongoose";

export default mongoose.model("MissedFetch", new mongoose.Schema({
  url: String,
  rank: Number,
  title: String,
  topchartid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topchart'
  }
}));