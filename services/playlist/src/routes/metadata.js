import express from "express";
import Album from "../models/Album";
import Artist from "../models/Artist";
import Emotion from "../models/Emotion";
import Language from "../models/Language";
import TopChart from "../models/TopChart";
import axios from "axios";
import { config } from "../config";


const router = express.Router();

router.get("/song/:songId", async (req, res) => {
  try {
    let output = {
      title: "OpenBeats",
      thumbnail: thumbnail_url,
      audioSrc: ''
    };
    const songId = req.params.songId;
    const isAudioSrc = req.query.audiosrc;

    const { thumbnail_url, title } = (await axios.get(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${songId}`)}`)).data;

    if (!thumbnail_url || !title) {
      throw new Error("Cannot find details for requested song.");
    }

    output.title = title;
    output.thumbnail = thumbnail_url;

    if (isAudioSrc) {
      const { data } = await (`${config.baseUrlLink}/opencc/${songId}`);
      if (data.status)
        output.audioSrc = data.link;
    }

    return res.json({
      status: true,
      data: output
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