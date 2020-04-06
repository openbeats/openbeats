import mongoose from "mongoose";


export default mongoose.model("Song", new mongoose.Schema({
    _id: String,
    title: String,
    thumbnail: String,
    duration: String,
    videoId: String,
    channelName: String,
    channelId: String,
    uploadedOn: String,
    views: String,
    description: String,
}))