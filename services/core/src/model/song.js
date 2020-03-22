import {
    Schema,
    model
} from "mongoose";


export default model("song", new Schema({
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