// importing required packages
const express = require("express");

// initiating router instance
const router = express.Router();

// importing required controllers
const fetchSongsController = require("../controllers/fetchSongs");
const deleteSongsController = require("../controllers/deleteSongsDoc");

// declaring required routes
router.post("/", fetchSongsController.fetchSongs);
router.delete("/", deleteSongsController.deleteSongsDoc);

// exporting router
module.exports = router;