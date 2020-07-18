// importing required packages
import crypto from "crypto";

// importing required models
const RipperCollection = require("../models/ripperCollection");

// deletes the requested gaana collection doc from database
exports.deleteSongsDoc = async (req, res) => {
  // computing the required hash
  const hashedAlbumURL = crypto
    .createHash("md5")
    .update(req.body["playlistURL"])
    .digest("hex");

  // deleting the required document
  await RipperCollection.findOneAndRemove({
    ripId: hashedAlbumURL
  },
    (err, doc) => {
      if (err) {
        console.error("Error in deleting document " + err);
        res.send({
          status: false,
          error: "Error occurred in deleting the document. Please check logs",
        });
      } else if (doc != null) {
        res.send({
          status: true,
          error: "Playlist deleted successfully"
        });
      } else {
        res.send({
          status: false,
          error: "Playlist not found in database"
        });
      }
    }
  );
};