const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const hotelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  photos: {
    type: [String],
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
  },
  featured: {
    type: Boolean,
    required: true,
  },
  rooms: {
    type: [{ room: String }],
    required: true,
  },
  cheapestPrice: { type: Number, required: true },
  title: { type: String, required: true },
});

module.exports = mongoose.model("Hotel", hotelSchema);
