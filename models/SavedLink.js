const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const savedLinkSchema = new mongoose.Schema({
  url: {
    type: String,
    trim: true,
    required: 'Please enter a URL to shorten'
  },
  idString: {
    type: String,
    trim: true,
    required: 'Oops, looks like no ID was passed'
  },
  timesVisited: Number
});

module.exports = mongoose.model('SavedLink', savedLinkSchema);
