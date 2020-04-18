import mongoose from "mongoose";

const searchTagSchema = new mongoose.Schema({
  searchVal: String,
});

export default mongoose.model(
  "SearchTag",
  searchTagSchema
);