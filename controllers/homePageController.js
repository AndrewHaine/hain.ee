const mongoose = require('mongoose');
const randomString = require('randomstring');
const SavedLink = mongoose.model('SavedLink');

exports.index = (req, res) => {
  res.render('index', {
    title: 'Hain.ee',
    content: 'Save some bytes, shorten that URL!',
    csrfToken: req.csrfToken()
  });
};

exports.addURL = async (req, res) => {
  // const newURL = await (new SavedLink(req.body)).save();
  console.log(req.body.url);
  res.redirect('/');
}
