// importing required packages
const cheerio = require("cheerio");
const axios = require("axios");
const crypto = require("crypto");

// holds the ytCat url
const obsHost = "https://staging-api.openbeats.live";

// importing required models
const RipperCollection = require("../../models/ripperCollection");

// checks if the ripper job is already in the ripper database
const checkForExsistingRipperDB = async (hashedAlbumURL) => {
  try {
    // query the database
    const ripperDoc = await RipperCollection.findOne({
        ripId: hashedAlbumURL
      },
      (err, doc) => {
        if (err) {
          console.log("Database FindOne error: " + err);
          return null;
        } else return doc;
      }
    );

    // returning the result
    return ripperDoc;
  } catch (err) {
    console.log("Error in checkForExsistingRipperDB " + err);
  }
};

// creates a job instance in the database
const createRipperJobDB = async (hashedAlbumURL) => {
  try {
    // constructing object to insert into database
    const newRipperJobDoc = {
      ripId: hashedAlbumURL,
      ripProgress: "Processing",
      ripData: [],
    };
    // creating instance of the model with the new document
    const ripperJob = new RipperCollection(newRipperJobDoc);
    // saving data into database
    await ripperJob.save();
    // returning confirmation
    return true;
  } catch (err) {
    console.log("Error in createRipperJobDB " + err);
    return false;
  }
};

// process the exsisting database object
const processExistingObjDB = async (ripperJobDoc) => {
  try {
    // getting the status value of the job in database
    const ripperJobStatus = ripperJobDoc.ripProgress;
    // changing operation based on ripperJon status
    switch (ripperJobStatus) {
      case "Processing":
        return {
          status: true,
            data: ripperJobDoc.ripData,
        };
      case "Error":
        // deleting the document to allow retrying
        await RipperCollection.deleteOne({
            ripId: ripperJobDoc.ripId
          },
          (err) => {
            console.log("Error in document deleting");
          }
        );
        return {
          status: false
        };
      case "Completed":
        return {
          status: true,
            data: ripperJobDoc.ripData,
        };
    }
  } catch (err) {
    console.log("Error in processExistingObjDb " + err);
  }
};

// initates database checks and responses
const databaseOperations = async (req, res, hashedAlbumURL) => {
  try {
    // checks if the ripper job is already in the ripper database
    const ripperJobExistence = await checkForExsistingRipperDB(hashedAlbumURL);

    // if the ripper job doesn't exist in database
    if (ripperJobExistence === null) {
      // creates a job instance in the database
      const createJobRes = await createRipperJobDB(hashedAlbumURL);
      // if the job has been created successfully
      if (createJobRes) {
        res.send({
          status: true,
          isProcessing: true,
          data: [],
        });
        return true;
      } else {
        return false;
      }
    } else {
      // process the exsisting database object
      const existingDbObjRes = await processExistingObjDB(ripperJobExistence);
      // returning result based on the recieved response from database
      if (existingDbObjRes["status"] === true) {
        res.send({
          status: true,
          isProcessing: ripperJobExistence.ripProgress === "Processing" ? true : false,
          data: existingDbObjRes["data"],
        });
      } else if (existingDbObjRes["status"] === false) {
        res.send({
          status: false,
          error: "An error has occurred in parsing the playlist. Please contact admin or try again.",
        });
      } else {
        res.send({
          status: true,
          data: existingDbObjRes,
        });
      }
      // do not start a new task
      return false;
    }
  } catch (err) {
    console.log("Error in databaseOperations " + err);
    res.send({
      status: false,
      error: "Database Operations initialization function error",
    });
    return false;
  }
};

// updates the database while the job is running
const updateRipperJobDB = async (
  albumObj,
  ytCatObjs,
  hashedAlbumURL,
  finalPush
) => {
  try {
    // checking that all parameters are not null
    if (albumObj != null && ytCatObjs != null && hashedAlbumURL != null) {
      // creating object to update the ripData in database with
      const ripDataObj = {
        albumTitle: albumObj["albumTitle"],
        audioTitlesInGaana: albumObj["songsLst"].length,
        audioObjsFetched: ytCatObjs.length,
        data: ytCatObjs,
      };
      // fetching the document for the current job from database (to check for error update)
      const currentDoc = await RipperCollection.findOne({
        ripId: hashedAlbumURL,
      });
      // checking if the progress value isn't error
      if (currentDoc.ripProgress !== "Error") {
        // updating the database
        await RipperCollection.updateOne({
            ripId: hashedAlbumURL
          }, {
            ripData: ripDataObj,
            ripProgress: !finalPush ? "Processing" : "Completed",
          },
          (err) => {
            if (err) console.log("Error while updating data " + err);
            else
              console.log(
                finalPush ?
                "Job complete and database updated!" :
                "Database Updated"
              );
          }
        );
      } else console.log("Error progress detected, not updating database");
    } else {
      // updating the database
      await RipperCollection.updateOne({
          ripId: hashedAlbumURL
        }, {
          ripProgress: "Error"
        },
        (err) => {
          if (err) console.log("Error while updating data " + err);
          else console.log("Error detected and database updated!");
        }
      );
    }
  } catch (err) {
    console.log("Error in updating database");
  }
};

// gets the html content of the playlist page
const getHTMLContent = async (playlistURL, hashedAlbumURL) => {
  try {
    // initializing puppeteer instance
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    // navigate to the playlist page
    const page = await browser.newPage();
    // navigating to playlist page and waiting till the page loads
    await page.goto(playlistURL, {
      waitUntil: "networkidle2"
    });
    // getting html content of the page
    const html = await page.content();
    // close the page
    browser.close();
    // returning the html content
    return html;
  } catch (err) {
    console.log("Puppeteer Error");
    // handling errors while also updating database
    await handleErrors(hashedAlbumURL);
  }
};

// get song list through non-film album method
const getSongLstNonFilmStructure = async ($, hashedAlbumURL) => {
  try {
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
  } catch (err) {
    console.log("Error in getSongLstNonFilmStructure" + err);
    // handling errors while also updating database
    await handleErrors(hashedAlbumURL);
  }
};

// get song list through film album method
const getSongLstFilmStructure = async ($, hashedAlbumURL) => {
  try {
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
  } catch (err) {
    console.log("Error in getSongLstFilmStructure" + err);
    // handling errors while also updating database
    await handleErrors(hashedAlbumURL);
  }
};

// gets the audio song titles from the html document and album title
const getAlbumInfo = async (htmlContent, hashedAlbumURL) => {
  try {
    // loading html content into cheerio
    const $ = cheerio.load(htmlContent);
    // fetching the album title
    let albumTitle = $("._d_tp_det").find("h1").text();
    // checking if albumTitle returned empty (if this is a trending list)
    if (albumTitle.length === 0) albumTitle = $(".trendingtitle").text();
    // checking if the albumTitle is still empty (if this is a movie album)
    if (albumTitle.length === 0) albumTitle = $(".album_songheading").text();

    // try getting the song list through non-film album method
    let songsLst = await getSongLstNonFilmStructure($, hashedAlbumURL);

    // checking if the artists have been fetched (if the album is a film album)
    if (songsLst[0]["artist"] === undefined)
      songsLst = await getSongLstFilmStructure($, hashedAlbumURL);

    // creating album object
    const albumObj = {
      albumTitle: albumTitle
    };
    // pushing album songs into albumObj
    albumObj["songsLst"] = songsLst;
    return albumObj;
  } catch (err) {
    console.log("Error in getting album info");
    // handling errors while also updating database
    await handleErrors(hashedAlbumURL);
  }
};

// gets the ytCat objects for all songs
const getYTCatObjs = async (hashedAlbumURL, albumObj) => {
  // get the songLst from the albumObj
  const songLst = albumObj["songsLst"];
  // holds the list of YTCatObjects
  const ytCatObjs = [];
  // iterating through each audioTitle
  for (const song of songLst) {
    // run till error is returned or the value is fetched
    while (true) {
      console.log(song);
      console.log("GETTING " + song["title"]);
      try {
        // setting up URL to ping
        let ytcatUrl =
          obsHost +
          "/ytcat?q=" +
          song["title"].replace(/[^\w\s-]/gi, "") +
          " " +
          song["artist"] +
          " lyrics&fr=true";
        console.log(ytcatUrl);
        // sending ytCat request
        let ytCatResponse = await axios.get(ytcatUrl);
        // cheking for response status
        if (ytCatResponse.status === 200) {
          // checking if data is returned
          if (ytCatResponse.data["data"].length > 0) {
            console.log("GOT", "\n");
            // pushing data into list
            ytCatObjs.push(ytCatResponse.data["data"][0]);
            // sending object to add song to database
            await updateRipperJobDB(albumObj, ytCatObjs, hashedAlbumURL, false);
            break;
          } else {
            console.log("Returned NULL... Retrying");
          }
        } else {
          await handleErrors(hashedAlbumURL);
          break;
        }
      } catch (err) {
        console.log(song["title"] + " " + err);
        await handleErrors(hashedAlbumURL);
        break;
      }
    }
  }

  // returning the object containing all the song objects
  return ytCatObjs;
};

// function to call to update the database as error and end the application
const handleErrors = async (hashedAlbumURL) => {
  // updating database
  await updateRipperJobDB(null, null, hashedAlbumURL);
};
// fetches the gaana song list
exports.fetchGannaSongs = async (req, res, next) => {
  try {
    // hashing the fetched album url
    const hashedAlbumURL = crypto
      .createHash("md5")
      .update(req.body["playlistURL"])
      .digest("hex");
    // initiating database operations
    const databaseOperationsRes = await databaseOperations(
      req,
      res,
      hashedAlbumURL
    );

    // checking if the job is new and processing has to start
    if (databaseOperationsRes) {
      // getting html content from the playlist url
      const htmlContent = req.body["htmlContent"];
      // getting the list of audio titles and album title
      const albumObj = await getAlbumInfo(htmlContent, hashedAlbumURL);
      //  gets the ytCat objects for all songs
      const ytCatObjs = await getYTCatObjs(hashedAlbumURL, albumObj);
      //updates the database POST job completion
      await updateRipperJobDB(albumObj, ytCatObjs, hashedAlbumURL, true);
    }
  } catch (err) {
    console.log("Main method error: " + err);
    // handling errors while also updating the database
    handleErrors(hashedAlbumURL);
    // if response has not already been sent
    if (res.headersSent)
      // sending error response
      res.send({
        status: false,
        error: err,
        errorPos: "Main method throw"
      });
  }
};