// importing required packages
const express = require("express");

// initiating router instance
const router = express.Router();

// importing required controllers
const fetchGannaController = require("../controllers/fetchGaana/fetchGaana");
const deleteGannaController = require("../controllers/fetchGaana/deleteGaanaDoc");

// declaring required routes

router.post("/", fetchGannaController.fetchGannaSongs);
router.delete("/", deleteGannaController.deleteGaanaDoc);

// exporting router
module.exports = router;
