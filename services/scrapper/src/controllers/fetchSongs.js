// importing required packages
import cheerio from "cheerio";
import axios from "axios";
import crypto from "crypto";
import {
  config
} from "../config";

// holds the ytCat url
const obsHost = config.isDev ? config.baseurl.dev : config.baseurl.prod;

// importing required models
const RipperCollection = require("../models/ripperCollection");

// global response variable reference
let globalRes;

// used to console log messages
const logConsole = (message, isErrorLog) => {
  if (isErrorLog)
    console.error(message);
  else
    console.log(message);
};

// used to send responses to the client
const sendResponse = (responseBody, responseType) => {
  if (!globalRes.headersSent) {
    switch (responseType) {
      case 0:
        globalRes.send({
          status: false,
          message: responseBody
        });
        break;
      default:
        break;
    }
    logConsole("Response sent to client", false);
  }
  else
    logConsole("Response already sent", true);
};

// filters the playlist url to find the service hosting the playlist
const filterPlaylistUrl = (playlistUrl) => {
  if (playlistUrl.includes("gaana.com"))
    return "gaana";
  else if (playlistUrl.includes("wynk.in"))
    return "wynk";
  else
    return null;
};

// function to get url and fetch songs
exports.fetchSongs = async (req, res) => {

  try {

    // setting global res variable
    globalRes = res;

    const playlistUrl = req.body.playlistUrl;
    logConsole("Playlist url recieved: " + playlistUrl, false);

    if (playlistUrl !== undefined) {

      // filtering the playlist url to find the service hosting the playlist
      const playlistUrlType = filterPlaylistUrl(playlistUrl);
      logConsole("Playlist hosting service: " + playlistUrlType, false);

      if (playlistUrlType !== null) {

        logConsole("Starting playlist url");
        sendResponse("Starting", 0);

      } else
        throw "Unsupported playlist url";
    } else
      throw "Please send playlist url";

  } catch (error) {
    logConsole("Error: " + error, true);
    sendResponse("Error Occurred: " + error, 0);
  }

};