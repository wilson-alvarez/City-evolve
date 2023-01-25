// DB Schema used in the database for the reviews
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number
})

module.exports = mongoose.model("Review", reviewSchema);