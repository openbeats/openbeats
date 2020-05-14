// importing required modules
const mongoose = require("mongoose");

// creating schema instance
const Schema = mongoose.Schema;

// creating schema for collection
const ripperCollectionSchema = new Schema(
  {
    ripId: {
      type: String,
      required: true,
      unique: true,
    },
    ripProgress: {
      type: String,
      required: true,
    },
    ripData: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

// declaring database operations
// static function to check if ripper job exsists in database and if it does, return the data

// exporting the model with the schema
module.exports = mongoose.model("rippercollection", ripperCollectionSchema);
