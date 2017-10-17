const mongoose = require('mongoose');
const SavedLink = mongoose.model('SavedLink');
const randStr = require('randomstring');
const {URL} = require('url');
const parseDomain = require('parse-domain');
const request = require('request');
const cheerio = require('cheerio');

const _doLookup = async (params = {}) => {
  const foundURL = await SavedLink.findOne(params);
  return foundURL ? {url: foundURL.url, idString: foundURL.idString} : false;
};

const _addNewLink = async (url, idString = randStr.generate(7)) => {

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

  return {url: url, idString: idString};
}

const _getURLMeta = async (url) => {
  return new Promise((resolve, reject) => {
    request(url, (err, resp, html) => {
      if(!err) {
        const $ = cheerio.load(html);
        const title = $('title').text();

        // Select an image to represent this page
        let imgSrc;
        if($('link[rel="apple-touch-icon"]').length) {
          imgSrc = $('link[rel="apple-touch-icon"]').attr('href');
        } else if ($('meta[name="og:image"]').length) {
          imgSrc = $('meta[name="og:image"]').attr('content');
        } else if($('link[rel="icon"]')) {
          imgSrc = $('link[rel="icon"]').attr('href');
        }

        // If the image src is relative to the site root we need to include the domain
        if(imgSrc && imgSrc.match(/^\//)) {
          console.log('Hello');
          imgSrc = new URL(imgSrc, url);
        }

        resolve({title: title, imgSrc: imgSrc || false});
      } else {
        reject('Page not found');
      }
    });
  });
};

exports.addURL = async (req, res) => {

  let targetURL = req.body.url;

  // If no url has been passed return an error
  if(!targetURL) {
    return res.status(400).send('Please enter a URL to shorten').end();
  }

  // If no http(s) prefix is set add one - Required for 301 redirects later
  if(!targetURL.match(/^http(s?):\/\//)) {
    targetURL = `http://${targetURL}`;
  }

  // Check the given url contains a valid tld
  const validTLD = parseDomain(targetURL) && parseDomain(targetURL).tld;
  if(!validTLD) {
    return res.status(400).send('Unable to shorten link, Please enter a valid URL').end();
  }


  let toReturn = {url: '', title: '', imgSrc: '', idString: ''};

  // Scrape the given webpage for some nice values
  try {
    const urlMeta = await _getURLMeta(req.body.url);
    if(urlMeta) Object.assign(toReturn, urlMeta);
  } catch(err) {
    toReturn.title = req.body.url;
  }



  // Check is this url has already been saved
  const checkExisting = await _doLookup({url: req.body.url});

  if(checkExisting) {
    Object.assign(toReturn, checkExisting);
    return res.json(toReturn).end();
  }

  // If no entry exists for the given url, create a new one
  let idString = req.body.customString || randStr.generate(7);

  const newURL = await _addNewLink(req.body.url);

  Object.assign(toReturn, newURL);
  res.json(toReturn).end();
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
