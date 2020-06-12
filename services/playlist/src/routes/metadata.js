import express from "express";
import Album from "../models/Album";
import Artist from "../models/Artist";
import Emotion from "../models/Emotion";
import Language from "../models/Language";
import TopChart from "../models/TopChart";
import axios from "axios";


const router = express.Router();

router.get("/song/:videoId",async(req,res)=>{
try {
  const videoId = req.params.videoId;

  const {thumbnail_url,thumbnail_width,thumbnail_height,title} =  (await axios.get(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`)).data;

  if( !thumbnail_url || !thumbnail_width || !thumbnail_height || !title){
    throw new Error("Cannot find details for requested song.");
  }

  return res.json({
    status: true,
    data:{
      title ,
      thumbnail :thumbnail_url,
      height:thumbnail_height,
      width:thumbnail_width
    }
  });

} catch (error) {
  console.error("Error occured - ", error.message);
    return res.json({
      status: false,
      data: error.message
    });
}
});


router.get("/:type/:id", async (req, res) => {
  try {

    const allowedTypesMap = {
      "album": Album,
      "artist": Artist,
      "emotion": Emotion,
      "language": Language,
      "topchart": TopChart
    };

    const type = req.params.type;

    if (!type || !Object.keys(allowedTypesMap).includes(type)) {
      throw new Error("Please specify the correct type of data you would like to get metadata.");
    }

    const requiredModel = allowedTypesMap[type];
    const requiredDoc = await requiredModel.findOne({
      _id: req.params.id
    }, {
      _id: true,
      name: 1,
      thumbnail: 2
    }).lean();

    if (!requiredDoc) {
      throw new Error("Cannot find document with given id in specified type.");
    }

    return res.json({
      status: true,
      data: requiredDoc
    });

  } catch (error) {

    console.error("Error occured - ", error.message);
    return res.json({
      status: false,
      data: error.message
    });

  }
});



export default router;