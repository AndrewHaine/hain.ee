const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const savedLinkSchema = new mongoose.Schema({
  url: {
    type: String,
    trim: true,
    required: 'Please enter a URL to shorten'
  },
  timesVisited: Number
});

module.exports = mongoose.model('SavedLink', savedLinkSchema);
