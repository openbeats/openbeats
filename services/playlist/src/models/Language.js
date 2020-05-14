import mongoose from "mongoose";
import User from "./reference/User";

const languageSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
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

export default mongoose.model("Language", languageSchema);