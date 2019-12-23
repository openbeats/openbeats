import mongoose from "mongoose";
// define Schema
var BookSchema = mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number
    });


// compile schema to model
var Book = mongoose.model('Book', BookSchema);

export {
    Book
}