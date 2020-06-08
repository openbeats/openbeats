import express from "express";
import Album from "../models/Album";
import Artist from "../models/Artist";
import Emotion from "../models/Emotion";
import Language from "../models/Language";
import TopChart from "../models/TopChart";


const router = express.Router();

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