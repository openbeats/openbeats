import express from "express";
import Album from "../models/Album";
import {
  check,
  body,
  validationResult
} from "express-validator";
import {
  uniqBy
} from "lodash";


const router = express.Router();

router.post("/create", [
  check("name", "Name is required")
  .not()
  .isEmpty(),
  check("userId", "User Id is required.")
  .not()
  .isEmpty(),
  check("artistTags", "Please pass atleast one artist tag in array.")
  .if(body('artistTags').exists())
  .isArray()
  .not()
  .isEmpty(),
  check("searchTags", "Please pass atleast one search tag in array.")
  .if(body('searchTags').exists())
  .isArray()
  .not()
  .isEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({
        status: false,
        data: errors.array().map(ele => `${ele.param} - ${ele.msg} `).join("\n")
      });
    }

    const {
      name,
      artistTags,
      searchTags,
      userId
    } = req.body;


    const newAlbum = {};
    newAlbum.name = name;
    newAlbum.createdBy = userId;
    newAlbum.updatedBy = userId;

    const album = new Album(newAlbum);
    await album.addDefultSearchTags();
    await album.save();

    res.send({
      status: true,
      data: {
        _id: album._id,
        name: album.name,
        thumbnail: album.thumbnail
      }
    });

    if (artistTags) {
      await album.addArtistTags(artistTags);
    }

    if (searchTags) {
      await album.addSearchTags(searchTags);
    }


  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      data: error.message
    });
  }
});

router.get("/metadata", async (req, res) => {
  try {
    const albumAll = await Album.find({}, {
      _id: true,
      name: 1,
      thumbnail: 2,
      totalSongs: 3,
    });
    if (!albumAll) {
      return res.json({
        status: false,
        data: "No albums found.",
      });
    }
    res.send({
      status: true,
      data: albumAll
    });
  } catch (error) {

    console.log(error.message);
    res.send({
      status: false,
      data: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
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

router.put("/:id/addsongs", [
  check("userId", "User Id is required.")
  .not()
  .isEmpty(),
  check("songs", "Please pass array of song objects to add.")
  .isArray()
  .not()
  .isEmpty(),
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      status: false,
      data: errors.array().map(ele => `${ele.param} - ${ele.msg} `).join("\n")
    });
  }

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

router.put("/:id/deletesong", [
  check("userId", "User Id is required.")
  .not()
  .isEmpty(),
  check("songId", "Please pass on the song Id to delete.")
  .not()
  .isEmpty(),
], async (req, res) => {
  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({
        status: false,
        data: errors.array().map(ele => `${ele.param} - ${ele.msg} `).join("\n")
      });
    }

    const {
      userId,
      songId
    } = req.body;

    await Album.findByIdAndUpdate(req.params.id, {
      $pull: {
        songs: {
          _id: songId,
        },
      },
    });

    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.json({
        status: false,
        data: "Album not found.",
      });
    }

    await album.updateOne({
      updatedAt: Date.now(),
      updatedBy: userId,
      totalSongs: album.songs.length,
      thumbnail: album.songs.length ?
        album.songs[0].thumbnail : "https://openbeats.live/static/media/dummy_music_holder.a3d0de2e.jpg",
    });

    await album.save();

    res.send({
      status: true,
      data: "Song has been deleted successfully",
    });
  } catch (error) {

    console.log(error.message);
    res.send({
      status: false,
      data: error.message,
    });

  }
});

router.put("/:id", [
  check("name", "Name must not be empty.")
  .if(body('name').exists())
  .not()
  .isEmpty(),
  check("userId", "User Id is required.")
  .not()
  .isEmpty(),
  check("artistTags", "Please pass atleast one artist tag in array.")
  .if(body('artistTags').exists())
  .isArray()
  .not()
  .isEmpty(),
  check("searchTags", "Please pass atleast one search tag in array.")
  .if(body('searchTags').exists())
  .isArray()
  .not()
  .isEmpty(),
], async (req, res) => {
  try {

    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.json({
        status: false,
        data: "Album not found.",
      });
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({
        status: false,
        data: errors.array().map(ele => `${ele.param} - ${ele.msg} `).join("\n")
      });
    }

    const {
      name,
      artistTags,
      searchTags,
      userId
    } = req.body;

    album.updatedBy = userId;

    if (name) {
      album.name = name;
      await album.addDefultSearchTags();
    }
    await album.save();
    res.send({
      status: true,
      data: {
        _id: album._id,
        name: album.name,
        thumbnail: album.thumbnail
      }
    });

    if (artistTags) {
      await album.addArtistTags(artistTags);
    }

    if (searchTags) {
      await album.addSearchTags(searchTags);
    }

  } catch (error) {

    console.log(error.message);
    res.send({
      status: false,
      data: error.message,
    });

  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Album.findByIdAndDelete(req.params.id);
    res.send({
      status: true,
      data: "Album got deleted successfully."
    });
  } catch (error) {
    console.log(error.message);
    res.send({
      status: false,
      data: error.message
    });
  }
});

export default router;