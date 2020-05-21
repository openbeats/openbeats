// importing required packages
import express from "express";
const multer = require('multer');
// declaring middlewares
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
// upload function to fetch and store the files sent locally
const upload = multer({
    storage: storage
});

// initiating router instance
const router = express.Router();

// importing required controllers
const fetchSongsController = require("../controllers/fetchSongs");
const deleteSongsController = require("../controllers/deleteSongsDoc");

// declaring required routes
router.post("/", upload.single('htmlContent'), fetchSongsController.fetchSongs);
router.delete("/", deleteSongsController.deleteSongsDoc);

// exporting router
module.exports = router;