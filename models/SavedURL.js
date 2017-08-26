const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const savedURLSchema = new Schema({
  url: {
    type: String,
    trim: true,
    required: 'Please enter a URL to shorten'
  },
  timesVisited: Number
});

module.exports = mongoose.model('SavedURL', savedURLSchema);
