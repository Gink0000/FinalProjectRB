const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  location: { type: String, required: true },
  country: { type: String, required: true }, 
  provinceOrState: { type: String, required: true },
  description: { type: String },
  longitude: { type: String, required: true },
  latitude: { type: String, required: true },
  pending: { type: Boolean, default: true },
  imageUrl: { type: String }
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;