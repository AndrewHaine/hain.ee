const mongoose = require('mongoose');
const SavedLink = mongoose.model('SavedLink');
const randStr = require('randomstring');

const _doLookup = async (params = {}) => {
  const foundURL = await SavedLink.findOne(params);
  return foundURL;
};

const _addNewLink = async (url, idString) => {

  // Stop duplicate lookup strings
  let stringIsUnique = false;

  while(!stringIsUnique) {
    let checkStringExists = await _doLookup({idString: idString});
    if(checkStringExists) {
      idString = randStr.generate(7);
    } else {
      stringIsUnique = true;
    }
  }

  await new SavedLink({
    url: url,
    idString: idString,
    timesVisited: 0
  }).save()
  return;
}


exports.addURL = async (req, res) => {

  // Check is this url has already been saved
  const checkExisting = await _doLookup({url: req.body.url});

  if(checkExisting) {
    res.redirect('/');
    return;
  }

  let idString = req.body.customString || randStr.generate(7);

  const newURL = await _addNewLink(req.body.url, 'fW1tHFr');

  res.redirect('/');
};

exports.checkRedirect = async (req, res) => {
  const redirectTo = await _doLookup({idString: req.params.id});
  if(redirectTo) {
    await SavedLink.findOneAndUpdate({idString: req.params.id}, { $inc: { timesVisited: 1 }});
    res.redirect(301, redirectTo.url);
  } else {
    res.render('errorPage', {status: '404', errMessage: 'It looks like you\'ve found a url that doesn\'t exist yet, shorten some more URLs, go on - you know you want to'});
  }
}
