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
      case 1:
        globalRes.send(
          responseBody
        );
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

// initiates scrapping sequence based on streaming service
const initiateScrappingSequence = async (htmlContent, playlistUrlType, hashedPlaylistUrl) => {
  // holds the playlist information post-scrapping
  let playlistInformation;
  // holds the YTCat objects, artists and titles for the songs
  const ytCatObjs = [], artitsts = [], titles = [];

  if (playlistUrlType === "gaana") {
    logConsole("Initiated scrapping gaana playlist structure", false);
    // scraps playlist content in gaana structure
    playlistInformation = await scrapGaanaPlaylist(htmlContent);
  }

  logConsole("Fetched gaana playlist song information", false);

  // check if the playlist already exsists in database using album title
  const playlistCheckDocUsingTitle = await RipperCollection.findOne({ "ripData.albumTitle": playlistInformation.albumTitle, ripService: playlistUrlType });

  if (playlistCheckDocUsingTitle === null) {

    // iterating through each song to fetch its ytcat object
    for (const songItem of playlistInformation.songList) {

      logConsole("Fetching ytcat object for " + songItem["title"], false);

      // fetching ytCatObject for the current songItem
      let tempYtCatObj = await fetchYTCatObjs(songItem);

      if (tempYtCatObj !== null) {
        ytCatObjs.push(tempYtCatObj);
        artitsts.push(songItem.artist);
        titles.push(songItem.title);
        // checking if this is the last object to be fetched
        if (songItem === playlistInformation.songList[playlistInformation.songList.length - 1])
          // sending ytCat object to be inserted into the database
          await updateDatabaseDocument(hashedPlaylistUrl, ytCatObjs, playlistInformation, artitsts, titles, true);
        else
          await updateDatabaseDocument(hashedPlaylistUrl, ytCatObjs, playlistInformation, artitsts, titles, false);
      }
    }
  }
  else {
    // deleting the currently created databse object
    await RipperCollection.deleteOne({ ripId: hashedPlaylistUrl });
    sendResponse("The playlist already exists in database. Please contact database admin to resolve issue.", 0);
    logConsole("It already Exists in database", false);
  }

};

// scraps playlist content in gaana structure
const scrapGaanaPlaylist = async (htmlContent) => {
  // loading html content into cheerio
  const $ = cheerio.load(htmlContent);
  // fetching the album title
  let albumTitle = $("._d_tp_det").find("h1").text();
  // checking if albumTitle returned empty (if this is a trending list)
  if (albumTitle.length === 0) albumTitle = $(".trendingtitle").text();
  // checking if the albumTitle is still empty (if this is a movie album)
  if (albumTitle.length === 0) albumTitle = $(".album_songheading").text();

  // try getting the song list through non-film album method
  let songsLst = await getGaanaSongListInNonFilmStructure($);

  // checking if the artists have been fetched (if the album is a film album)
  if (songsLst[0]["artist"] === undefined)
    songsLst = await getGaanaSongListInFilmStructure($);

  // creating album object
  const albumObj = {
    albumTitle: albumTitle,
    songList: songsLst
  };
  return albumObj;
};

// get song list through non-film album method
const getGaanaSongListInNonFilmStructure = async ($) => {

  // holds the list of song titles
  const songsLst = [];
  // fetching all Divs containing all songs
  const songDivs = $(".content-container").find(".track_npqitemdetail");
  // iterating through each div
  songDivs.each((i, songDiv) => {
    // constains instance of each song
    let songObj = {};
    // getting the song title
    songObj["title"] = $(songDiv).find("span").text();
    // cycling through the artists and getting the first one
    $(songDiv)
      .find("a")
      .each(async (i, artistAnchor) => {
        songObj["artist"] = await $(artistAnchor).text();
      });
    // checking if the audio artist is undefined, which would mean this is a movie album and thus, the artist name is in different
    songsLst.push(songObj);
  });
  // returning songLst
  return songsLst;
};

// get song list through film album method
const getGaanaSongListInFilmStructure = async ($) => {

  // holds the list of song titles
  const songsLst = [];
  // getting to the unordered list containing all songs
  const allSongUL = await $(".content-container")
    .find(".s_c")
    .find("ul")
    .toArray()[1];

  // finding all the list items (songs in the unordered list)
  const songsLstItems = await $(allSongUL)
    .find('li[draggable="true"]')
    .toArray();

  // iterating through each song list item which contains multiple other list items
  for (const multiListItems of songsLstItems) {
    // constains instance of each song
    let songObj = {};
    // getting to the list item containing the song details
    let songDetailLstItem = await $(multiListItems).find("li").toArray()[2];
    // getting the song title stored in the 3rd list item
    songObj["title"] = await $(
      $(songDetailLstItem).find("a").toArray()[0]
    ).text();
    // getting the song artist stored in the 3rd list item
    songObj["artist"] = await $(
      $(songDetailLstItem).find("a").toArray()[1]
    ).text();

    // pushing song object into list
    songsLst.push(songObj);
  }

  // returning the song lst
  return songsLst;

};

// function to fetch ytcat objects for the songs scrapped
const fetchYTCatObjs = async (songItem) => {
  // counter for number of times to retry fetching ytcat object
  let retryCounter = -1;

  while (true) {
    retryCounter += 1;

    if (retryCounter === 10) break;

    // setting up URL to ping
    let ytcatUrl =
      obsHost +
      "/ytcat?q=" +
      songItem["title"].replace(/[^\w\s-]/gi, "") +
      " " +
      songItem["artist"] +
      " lyrics&fr=true";

    // sending ytCat request
    let ytCatResponse = await axios.get(ytcatUrl);

    // cheking for response status
    if (ytCatResponse.status === 200) {

      // checking if data is returned
      if (ytCatResponse.data["data"].length > 0)
        return ytCatResponse.data["data"][0];
      else
        logConsole("Returned NULL. Retrying", false);
    } else
      break;
  }
  // default return
  return null;
};

// updates the database on fetching the ytcat values
const updateDatabaseDocument = async (hashedPlaylistUrl, ytCatObjs, playlistInformation, artitsts, titles, finalSong) => {

  // fetching the document for the current job from database (to check for error update)
  const currentDoc = await RipperCollection.findOne({
    ripId: hashedPlaylistUrl,
  });

  if (currentDoc.ripProgress !== "Error") {
    const updateData = {
      ripProgress: (finalSong) ? "Completed" : "InProgress",
      ripData: {
        albumTitle: playlistInformation.albumTitle,
        audioTitlesInGaana: playlistInformation.songList.length,
        audioObjsFetched: ytCatObjs.length,
        artists: artitsts,
        titles: titles,
        data: ytCatObjs,
      },
    };
    // updating database
    await RipperCollection.updateOne({
      ripId: hashedPlaylistUrl,
    }, updateData);
  }
};

// updates the database value of the current playlist as error
const updateDatabaseForError = async (hashedPlaylistUrl) => {
  await RipperCollection.updateOne({ ripId: hashedPlaylistUrl }, { ripProgress: "Error" });
};

// sends back the current status of the playlist database values to the user
const sendCurrentDatabaseValues = async (hashedPlaylistUrl) => {

  const currentDoc = await RipperCollection.findOne({ ripId: hashedPlaylistUrl });

  if (currentDoc.ripProgress !== "Error")
    sendResponse({
      status: true,
      streamingService: currentDoc.ripService,
      processing: (currentDoc.ripProgress === "Completed") ? false : true,
      data: currentDoc.ripData,
    }, 1);
  else {
    // deleting the error document
    await RipperCollection.deleteOne({ ripId: hashedPlaylistUrl });
    sendResponse("An Error has occurred. Please try again or refer to the logs", 0);
  }

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

        const hashedPlaylistUrl = crypto
          .createHash("md5")
          .update(playlistUrl)
          .digest("hex");
        logConsole("Generated hash for playlistUrl: " + hashedPlaylistUrl, false);

        // checks if playlist already exists in database
        const playlistDBDocument = await RipperCollection.findOne({ ripId: hashedPlaylistUrl });

        if (playlistDBDocument === null) {
          logConsole("Playlist does not exist in database", false);

          const htmlContent = req.body.htmlContent;

          if (htmlContent != undefined) {
            // create document for the playlist in database
            const newPlaylistDocument = RipperCollection({
              ripId: hashedPlaylistUrl,
              ripService: playlistUrlType,
              ripProgress: "InProgress",
              ripData: {},
            });
            await newPlaylistDocument.save();
            logConsole("Document created for playlist in database", false);

            // initiate the scrapping sequence
            initiateScrappingSequence(htmlContent, playlistUrlType, hashedPlaylistUrl);

            sendResponse({ status: true, streamingService: playlistUrlType, processing: true, data: {} }, 1);
          } else {
            logConsole("Error: No HTML data received", true);
            sendResponse("Error Occurred: No HTML data recieved", 0);
          }

        } else {
          logConsole("Playlist exist in database", false);
          await sendCurrentDatabaseValues(hashedPlaylistUrl);
        }
      } else
        throw "Unsupported playlist url";
    } else
      throw "Please send playlist url";

  } catch (error) {
    logConsole("Error: " + error, true);
    sendResponse("Error Occurred: " + error, 0);
    await updateDatabaseForError(hashedPlaylistUrl);
  }

};

// handling promise rejection errors
process.on("unhandledRejection", error => {
  logConsole("Error: " + error, true);
});