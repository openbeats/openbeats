import express from "express";
import Album from "../models/Album";
import {
  check,
  validationResult
} from "express-validator";
import {
  uniqBy
} from "lodash";


const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const {
      name,
      userId
    } = req.body;
    const album = new Album({
      name,
      createdBy: userId
    });
    album.addDefultSearchTags();
    await album.save();
    res.send({
      status: true,
      data: album
    });
  } catch (error) {
    console.log(error.message);
    res.send({
      status: false,
      data: error.message
    });
  }
});

router.get("/:id/getalbum", async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.json({
        status: false,
        data: "Album not found.",
      });
    }
    res.send({
      status: true,
      data: album
    });
  } catch (error) {
    console.log(error.message);
    res.send({
      status: false,
      data: error.message,
    });
  }
});

router.post("/:id/addsongs", async (req, res) => {
  const {
    userId,
    songs
  } = req.body;
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.json({
        status: false,
        data: "Album not found.",
      });
    }
    let newSongsList = [...songs, ...album.songs];
    newSongsList = uniqBy(newSongsList, 'videoId');
    album.songs = newSongsList;
    await album.save();
    await album.updateOne({
      updatedAt: Date.now(),
      updatedBy: userId,
      totalSongs: album.songs.length,
      thumbnail: album.songs[0].thumbnail,
    });
    await album.save();
    res.send({
      status: true,
      data: album,
    });
  } catch (error) {
    console.log(error.message);
    res.send({
      status: false,
      data: error.message,
    });
  }
});


router.put("/:id/update", async (req, res) => {
  try {

  } catch (error) {

  }
});

router.delete("/:id/delete", async (req, res) => {
  try {

  } catch (error) {

  }
});

export default router;