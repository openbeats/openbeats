import Artist from "../models/Artist";
import {
  Router
} from "express";

import {
  check,
  oneOf,
  validationResult
} from "express-validator";



const router = Router();

router.post("/create", async (req, res) => {
  try {
    const {
      name,
      thumbnail
    } = req.body;
    const artist = new Artist({
      name,
      thumbnail
    });
    await artist.save();
    res.send({
      status: true,
      data: artist
    });
  } catch (error) {
    console.log(error.message);
    res.send({
      status: false,
      data: error.message
    })
  }
})

router.get("/fetch", oneOf([
  check('artistId').exists(),
  check('startsWith').exists()
]), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        status: false,
        data: "Please provide either artistId or startsWith as query params."
      });
    }
    const {
      artistId,
      startsWith
    } = req.query();

    if (artistId) {
      const artist = await Artist.findById(tagId);
      return res.send({
        status: true,
        data: artist
      });
    }
    if (startsWith) {

      const artists = await Artist.find({
        'name': {
          '$regex': `^${name}`,
          '$options': 'i'
        }
      });
      return res.send({
        status: true,
        data: artists
      });
    }
    return res.send({
      status: false,
      data: []
    });
  } catch (error) {
    console.log(error.message);
    res.send({
      status: false,
      data: error.message
    });
  }
})

router.put("/id", async (req, res) => {
  try {
    const {
      name,
      albumId,
      thumbnail
    } = req.body;

    const artist = await Artist.findById(req.params.id);
    if (name) {
      artist.name = name;
    }
    if (albumId) {
      artist.albumTags.push(albumId);
    }
    if (thumbnail) {
      artist.thumbnail = thumbnail;
    }
    await artist.save()
    return res.send({
      status: false,
      data: artist
    })
  } catch (error) {
    console.log(error.message);
    return res.send({
      status: false,
      data: error.message
    });
  }
})

router.delete("/:id", async (req, res) => {
  try {
    await Artist.findByIdAndDelete(req.params.id);
    res.send({
      status: true,
      data: "Artist got deleted successfully."
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